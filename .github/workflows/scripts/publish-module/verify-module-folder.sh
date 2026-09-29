#!/usr/bin/env bash
# Verifies MODULE_PATH points to a safe, existing folder under packages/.
# Usage: MODULE_PATH=packages/module/my-extension ./verify-module-folder.sh
set -euo pipefail

MODULE_SUBPATH="${MODULE_PATH#packages/}"

if [[ ! "$MODULE_SUBPATH" =~ ^[A-Za-z0-9_-]+(/[A-Za-z0-9_-]+)*$ ]]; then
  echo "Invalid module path: '$MODULE_SUBPATH'. Only letters, numbers, hyphens, underscores, and '/' between segments are allowed (no '..', no leading '/', no dots)." >&2
  exit 1
fi

test -d "$MODULE_PATH" || { echo "No such folder: $MODULE_PATH"; exit 1; }
