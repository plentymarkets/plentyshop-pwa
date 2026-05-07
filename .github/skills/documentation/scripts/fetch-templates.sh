#!/usr/bin/env bash
# Fetches The Good Docs Project templates and guides for a given document type.
#
# Usage:
#   ./fetch-templates.sh <type>
#
# Types:
#   concept   — Explanation / background knowledge (Diataxis: Explanation)
#   how-to    — Step-by-step task guide (Diataxis: How-to)
#   tutorial  — Learning-oriented walkthrough (Diataxis: Tutorial)
#   all       — Fetch all types

set -euo pipefail

BASE="https://gitlab.com/tgdp/templates/-/raw/main"

fetch_type() {
  local type="$1"
  echo "================================================================"
  echo "  TEMPLATE: ${type}"
  echo "================================================================"
  curl -fsSL "${BASE}/${type}/template_${type}.md"
  echo ""
  echo "----------------------------------------------------------------"
  echo "  GUIDE: ${type}"
  echo "----------------------------------------------------------------"
  curl -fsSL "${BASE}/${type}/guide_${type}.md"
  echo ""
}

TYPE="${1:-}"

case "$TYPE" in
  concept|how-to|tutorial)
    fetch_type "$TYPE"
    ;;
  all)
    for t in concept how-to tutorial; do
      fetch_type "$t"
    done
    ;;
  *)
    echo "Usage: $0 <concept|how-to|tutorial|all>" >&2
    exit 1
    ;;
esac
