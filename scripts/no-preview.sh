#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./ensure-no-preview.sh [path-to-nitro.mjs]
#
# If no path is given, it defaults to:
#   ./apps/web/.output/server/chunks/nitro/nitro.mjs

NITRO_FILE="${1:-./apps/web/.output/server/chunks/nitro/nitro.mjs}"

echo "[isPreview check] Checking $NITRO_FILE"

if [[ ! -f "$NITRO_FILE" ]]; then
  echo "[isPreview check] Nitro output not found at $NITRO_FILE" >&2
  exit 1
fi

# Look for `"isPreview": true` (allowing spaces around :)
if grep -q '"isPreview"[[:space:]]*:[[:space:]]*true' "$NITRO_FILE"; then
  # In-place replace; use .bak for macOS-compatible sed, then remove backup
  sed -i.bak -E 's/"isPreview"[[:space:]]*:[[:space:]]*true/"isPreview": false/g' "$NITRO_FILE"
  rm -f "$NITRO_FILE.bak" || true

  echo "[isPreview check] Build contained \"isPreview\": true in Nitro output." >&2
  echo "[isPreview check] It has been rewritten to \"isPreview\": false to protect the shop." >&2
  echo "[isPreview check] Please ensure nuxt.config / environment do not enable preview mode before building." >&2

  # Still fail CI so the misconfiguration gets fixed at the source
  exit 1
else
  echo "[isPreview check] OK: no \"isPreview\": true found in Nitro output."
fi