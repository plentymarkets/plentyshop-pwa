#!/usr/bin/env bash
# Checks required meta files (package.json, icons, docs) exist, and that icons
# match the expected PNG dimensions.
# Usage: MODULE_PATH=packages/module-my-extension ./validate-meta-files.sh
set -euo pipefail

IMAGES_DIR="$MODULE_PATH/meta/images"
missing=()
errors=()

check_file() {
  [[ -f "$MODULE_PATH/$1" ]] || missing+=("$1")
}

check_png_dimensions() {
  local file="$1" expected_w="$2" expected_h="$3" allow_shorter="$4"
  [[ -f "$file" ]] || return

  local info
  info=$(file -b "$file")
  if [[ "$info" != PNG\ image\ data* ]]; then
    errors+=("$file is not a valid PNG file")
    return
  fi

  local dims w h
  dims=$(grep -oE '[0-9]+ x [0-9]+' <<< "$info" | head -1)
  w="${dims%% x *}"
  h="${dims##* x }"

  if [[ "$w" != "$expected_w" ]]; then
    errors+=("$file has width ${w}px, expected ${expected_w}px")
  fi

  if [[ "$allow_shorter" == "true" ]]; then
    if (( h > expected_h )); then
      errors+=("$file has height ${h}px, expected at most ${expected_h}px")
    fi
  elif [[ "$h" != "$expected_h" ]]; then
    errors+=("$file has height ${h}px, expected ${expected_h}px")
  fi
}

check_file "package.json"

for subject in author plugin; do
  for size in xs sm md; do
    check_file "meta/images/icon_${subject}_${size}.png"
  done
done

# Author icon must be exactly square at each fixed size.
check_png_dimensions "$IMAGES_DIR/icon_author_xs.png" 32 32 false
check_png_dimensions "$IMAGES_DIR/icon_author_sm.png" 256 256 false
check_png_dimensions "$IMAGES_DIR/icon_author_md.png" 512 512 false

# Plugin icon may be rectangular: width is fixed, height may only be reduced.
check_png_dimensions "$IMAGES_DIR/icon_plugin_xs.png" 32 32 true
check_png_dimensions "$IMAGES_DIR/icon_plugin_sm.png" 256 256 true
check_png_dimensions "$IMAGES_DIR/icon_plugin_md.png" 512 512 true

for doc in support_contact changelog user_guide; do
  for lang in en de; do
    path="meta/documents/${doc}_${lang}.md"
    check_file "$path"
    if [[ -f "$MODULE_PATH/$path" && ! -s "$MODULE_PATH/$path" ]]; then
      errors+=("$path exists but is empty")
    fi
  done
done

support_contact_en="$MODULE_PATH/meta/documents/support_contact_en.md"
if [[ -f "$support_contact_en" ]] && ! grep -q '@' "$support_contact_en"; then
  errors+=("meta/documents/support_contact_en.md must include a support email address")
fi

if [[ ${#missing[@]} -gt 0 || ${#errors[@]} -gt 0 ]]; then
  echo "Module package \"$MODULE_PATH\" failed meta file validation:" >&2
  for m in "${missing[@]}"; do echo "  - missing: $m" >&2; done
  printf '  - %s\n' "${errors[@]}" >&2
  exit 1
fi

echo "Module package \"$MODULE_PATH\" passes meta file validation."
