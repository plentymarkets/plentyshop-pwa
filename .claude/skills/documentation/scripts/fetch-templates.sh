#!/usr/bin/env bash
# Prints The Good Docs Project templates and guides for a given document type
# from local copies in ../templates/.
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="${SCRIPT_DIR}/../templates"

fetch_type() {
  local type="$1"
  echo "================================================================"
  echo "  TEMPLATE: ${type}"
  echo "================================================================"
  cat "${TEMPLATES_DIR}/template_${type}.md"
  echo ""
  echo "----------------------------------------------------------------"
  echo "  GUIDE: ${type}"
  echo "----------------------------------------------------------------"
  cat "${TEMPLATES_DIR}/guide_${type}.md"
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
