#!/usr/bin/env bash
# Finds Markdown files that reference a given term (an old path, title, or
# slug), so the ripple-update phase knows what else needs editing.
#
# Usage:
#   ./find-references.sh <term> [more-terms...]
#
# Searches docs/, README.md, and apps/*/README.md. Prints matches as
# <file>:<line>:<content>.

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <term> [more-terms...]" >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

ROOTS=(docs README.md)
for readme in apps/*/README.md; do
  [ -f "$readme" ] && ROOTS+=("$readme")
done

TERM_ARGS=()
for term in "$@"; do
  TERM_ARGS+=(-e "$term")
done

if ! grep -rniF --include='*.md' "${TERM_ARGS[@]}" -- "${ROOTS[@]}"; then
  echo "No references found for: $*"
fi
