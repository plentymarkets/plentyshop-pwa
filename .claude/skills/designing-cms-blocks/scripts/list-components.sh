#!/usr/bin/env bash
# Lists real, currently-available components from the three sources CMS block
# forms/markup are built from. Run this instead of maintaining a widget catalog
# doc — it can't go stale.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"

print_dir() {
  local label="$1" dir="$2"
  echo "## ${label}"
  if [ -d "$dir" ]; then
    find "$dir" -mindepth 1 -maxdepth 1 \( -type d -o -name '*.vue' \) -exec basename {} \; |
      sed 's/\.vue$//' |
      sort -u
  else
    echo "(not found: $dir)"
  fi
  echo
}

print_dir "components/editor (CMS/editor base components)" "$repo_root/apps/web/app/components/editor"
print_dir "components/ui (shop base components)" "$repo_root/apps/web/app/components/ui"
print_dir "@storefront-ui/vue (design system primitives)" "$repo_root/node_modules/@storefront-ui/vue/dist/components"
