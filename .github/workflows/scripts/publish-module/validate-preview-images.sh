#!/usr/bin/env bash
# Checks that meta/images has 1-7 preview_*.png files, each a valid PNG under 1 MB.
# Usage: MODULE_PATH=packages/module/my-extension ./validate-preview-images.sh
set -euo pipefail

IMAGES_DIR="$MODULE_PATH/meta/images"
MAX_BYTES=$((1024 * 1024))

shopt -s nullglob
previews=("$IMAGES_DIR"/preview_*.png)
shopt -u nullglob

count=${#previews[@]}
if (( count < 1 || count > 7 )); then
  echo "Expected between 1 and 7 preview images (preview_<n>.png) in $IMAGES_DIR, found $count." >&2
  exit 1
fi

errors=()

for img in "${previews[@]}"; do
  if ! file -b "$img" | grep -q "^PNG image data"; then
    errors+=("$img is not a valid PNG file")
    continue
  fi

  size=$(stat -c%s "$img" 2>/dev/null || stat -f%z "$img")
  if (( size > MAX_BYTES )); then
    errors+=("$img is ${size} bytes, exceeds the 1 MB (1048576 byte) limit")
  fi
done

if [[ ${#errors[@]} -gt 0 ]]; then
  echo "Preview image validation failed:" >&2
  printf '  - %s\n' "${errors[@]}" >&2
  exit 1
fi

echo "Found $count preview image(s) in $IMAGES_DIR, all within limits."
