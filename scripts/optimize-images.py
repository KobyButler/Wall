"""
Optimize source photos into responsive WebP files + a manifest the build reads.

Usage:
    python scripts/optimize-images.py <source-dir> [--large name1,name2,...]

For every .jpg/.jpeg/.png/.webp in <source-dir> this writes
    public/assets/img/photos/<name>-<width>.webp   (640, 1024, 1600 — plus 2200 for --large)
and records width/height/available sizes/average color in src/data/images.json.

Use --large for images shown full-bleed (page heroes, background bands) so big
screens get a sharp 2200px version. Re-running is safe; existing entries for
other images are kept.

Requires Pillow:  pip install Pillow
"""
import json
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "assets", "img", "photos")
MANIFEST = os.path.join(ROOT, "src", "data", "images.json")
BASE_WIDTHS = [640, 1024, 1600]
LARGE_WIDTH = 2200
QUALITY = 70


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    src = sys.argv[1]
    large = set()
    if "--large" in sys.argv:
        large = set(sys.argv[sys.argv.index("--large") + 1].split(","))

    os.makedirs(OUT_DIR, exist_ok=True)
    manifest = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST, encoding="utf8") as f:
            manifest = json.load(f)

    files = sorted(f for f in os.listdir(src) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
    for fname in files:
        name = os.path.splitext(fname)[0]
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, fname))).convert("RGB")
        w, h = im.size
        targets = BASE_WIDTHS + ([LARGE_WIDTH] if name in large else [])
        widths = sorted({min(t, w) for t in targets})
        for tw in widths:
            th = round(h * tw / w)
            im.resize((tw, th), Image.LANCZOS).save(
                os.path.join(OUT_DIR, f"{name}-{tw}.webp"), "WEBP", quality=QUALITY, method=6
            )
        r, g, b = im.resize((1, 1), Image.BOX).getpixel((0, 0))
        top = widths[-1]
        manifest[name] = {
            "w": top,
            "h": round(h * top / w),
            "widths": widths,
            "color": f"#{r:02x}{g:02x}{b:02x}",
        }
        print(f"{name}: {widths}")

    with open(MANIFEST, "w", encoding="utf8") as f:
        json.dump(dict(sorted(manifest.items())), f, indent=2)
    print(f"Wrote {len(files)} images -> {os.path.relpath(MANIFEST, ROOT)}")


if __name__ == "__main__":
    main()
