#!/usr/bin/env bash
# Encode a clip for the home page hero slideshow (or the stats band).
#
#   bash scripts/encode-hero-video.sh <input-video> <name> [start-seconds] [duration-seconds]
#
# Writes, ready to reference from src/data/site.mjs (hero.slides[].video = "<name>"):
#   public/assets/video/<name>.mp4         1920×1080, ~2–3 MB  (desktop)
#   public/assets/video/<name>-sm.mp4       960×540,  <1 MB    (phones)
#   public/assets/img/posters/<name>.webp   first frame, shown while the video loads
#   public/assets/img/posters/<name>-sm.webp
#
# Tips: 6–10 second clips loop best. Audio is stripped. Requires ffmpeg.
set -euo pipefail

IN="${1:?input video required}"
NAME="${2:?output name required, e.g. hero-driveway}"
SS="${3:-0}"
T="${4:-8}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VID="$ROOT/public/assets/video"
POS="$ROOT/public/assets/img/posters"
mkdir -p "$VID" "$POS"

ffmpeg -v error -y -ss "$SS" -t "$T" -i "$IN" -an \
  -vf "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p" \
  -c:v libx264 -preset slow -crf 28 -profile:v high -g 60 -movflags +faststart "$VID/$NAME.mp4"

ffmpeg -v error -y -ss "$SS" -t "$T" -i "$IN" -an \
  -vf "fps=30,scale=960:540:force_original_aspect_ratio=increase,crop=960:540,format=yuv420p" \
  -c:v libx264 -preset slow -crf 29 -profile:v main -g 60 -movflags +faststart "$VID/$NAME-sm.mp4"

ffmpeg -v error -y -i "$VID/$NAME.mp4" -frames:v 1 -c:v libwebp -quality 72 "$POS/$NAME.webp"
ffmpeg -v error -y -i "$VID/$NAME.mp4" -frames:v 1 -vf "scale=960:-2" -c:v libwebp -quality 70 "$POS/$NAME-sm.webp"

echo "Done: $NAME ($(du -k "$VID/$NAME.mp4" | cut -f1) KB desktop, $(du -k "$VID/$NAME-sm.mp4" | cut -f1) KB mobile)"
