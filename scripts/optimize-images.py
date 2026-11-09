"""
Turn the photo library (content/media) into responsive WebP files for the site.

Usage (normally run for you by `npm run build` / `npm run dev`):
    python scripts/optimize-images.py [source-dir] [output-dir]

Defaults: source = content/media, output = .cache/images.
For every .jpg/.jpeg/.png/.webp/.heic photo it writes
    <output>/photos/<name>-<width>.webp   (640, 1024, 1600, 2048 — never upscaled)
and records size, available widths and average color in <output>/images.json.
<name> is the file name without its extension, lower-cased and slugified, so
"/media/Tank Pour.JPG" becomes "tank-pour".

It is incremental: photos whose content hasn't changed since the last run are
skipped, so only new uploads are processed. Photos that were removed from the
library are dropped from the manifest.

Requires Pillow (`pip install Pillow`). iPhone HEIC photos also need
`pip install pillow-heif` (or ffmpeg on the PATH as a fallback).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTHS = [640, 1024, 1600, 2048]
QUALITY = 70
EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif")

try:
    import pillow_heif

    pillow_heif.register_heif_opener()
    HEIF = True
except ImportError:
    HEIF = False


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", os.path.splitext(name)[0].lower()).strip("-")


def file_hash(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


def open_image(path):
    if path.lower().endswith((".heic", ".heif")) and not HEIF:
        # Fallback: let ffmpeg decode HEIC to a temporary JPEG.
        tmp = os.path.join(tempfile.mkdtemp(), "frame.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-frames:v", "1", "-q:v", "2", tmp], check=True)
        return Image.open(tmp)
    return Image.open(path)


def main():
    src = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, "content", "media")
    out = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.join(ROOT, ".cache", "images")
    photos = os.path.join(out, "photos")
    manifest_path = os.path.join(out, "images.json")
    os.makedirs(photos, exist_ok=True)

    manifest = {}
    if os.path.exists(manifest_path):
        with open(manifest_path, encoding="utf8") as f:
            manifest = json.load(f)

    files = sorted(f for f in os.listdir(src) if f.lower().endswith(EXTENSIONS)) if os.path.isdir(src) else []
    seen, processed, failed = set(), 0, []
    for fname in files:
        key = slug(fname)
        seen.add(key)
        path = os.path.join(src, fname)
        digest = file_hash(path)
        entry = manifest.get(key)
        if entry and entry.get("hash") == digest and all(
            os.path.exists(os.path.join(photos, f"{key}-{w}.webp")) for w in entry["widths"]
        ):
            continue
        try:
            im = ImageOps.exif_transpose(open_image(path)).convert("RGB")
        except Exception as e:  # unreadable or unsupported file — skip it, keep building
            failed.append(f"{fname}: {e}")
            continue
        w, h = im.size
        widths = sorted({min(t, w) for t in WIDTHS})
        for tw in widths:
            im.resize((tw, round(h * tw / w)), Image.LANCZOS).save(
                os.path.join(photos, f"{key}-{tw}.webp"), "WEBP", quality=QUALITY, method=6
            )
        r, g, b = im.resize((1, 1), Image.BOX).getpixel((0, 0))
        top = widths[-1]
        manifest[key] = {
            "w": top,
            "h": round(h * top / w),
            "widths": widths,
            "color": f"#{r:02x}{g:02x}{b:02x}",
            "hash": digest,
        }
        processed += 1
        print(f"  optimized {fname} -> {key} {widths}")

    for key in [k for k in manifest if k not in seen]:
        for w in manifest[key]["widths"]:
            p = os.path.join(photos, f"{key}-{w}.webp")
            if os.path.exists(p):
                os.remove(p)
        del manifest[key]

    with open(manifest_path, "w", encoding="utf8") as f:
        json.dump(dict(sorted(manifest.items())), f, indent=2)
    print(f"Images: {len(manifest)} in library, {processed} optimized this run" + (f", {len(failed)} skipped" if failed else ""))
    for msg in failed:
        print(f"  WARNING could not read {msg}")


if __name__ == "__main__":
    main()
