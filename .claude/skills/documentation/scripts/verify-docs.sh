#!/usr/bin/env bash
# Verifies documentation changes before they're considered done:
#   1. Runs Prettier (npm run format:fix)
#   2. Fails if any changed file falls outside docs/, README.md, apps/*/README.md
#   3. Fails if any relative Markdown link in a changed file doesn't resolve
#
# Usage:
#   ./verify-docs.sh
#
# Run from anywhere inside the repo. Exits non-zero on any failure with a
# message identifying the offending file/link. Fix and re-run until it passes.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "Running npm run format:fix..."
npm run format:fix

CHANGED_FILES="$( { git diff --name-only HEAD; git ls-files --others --exclude-standard; } | sort -u | grep -v '^$' || true)"

if [ -z "$CHANGED_FILES" ]; then
  echo "No changed files to verify."
  exit 0
fi

FAIL=0

echo "Checking changed files are within allowed doc paths..."
while IFS= read -r file; do
  case "$file" in
    docs/*|README.md|apps/*/README.md|.claude/skills/documentation/references/lessons.md)
      ;;
    *)
      echo "FAILED: '$file' is outside docs/, README.md, apps/*/README.md" >&2
      FAIL=1
      ;;
  esac
done <<< "$CHANGED_FILES"

echo "Checking relative Markdown links resolve..."
while IFS= read -r file; do
  case "$file" in
    *.md) ;;
    *) continue ;;
  esac
  [ -f "$file" ] || continue
  dir="$(dirname "$file")"
  while IFS= read -r link; do
    [ -n "$link" ] || continue
    link="${link%%#*}"
    [ -n "$link" ] || continue
    case "$link" in
      http://*|https://*|mailto:*) continue ;;
    esac
    # Root-relative links (leading '/') are resolved against the docs/ root
    # for docs/ files (VitePress convention), or the repo root otherwise.
    case "$link" in
      /*)
        case "$file" in
          docs/*) target="docs${link}" ;;
          *) target="${link#/}" ;;
        esac
        ;;
      *) target="$dir/$link" ;;
    esac
    if [ ! -e "$target" ]; then
      echo "FAILED: $file links to '$link' which does not resolve (checked $target)" >&2
      FAIL=1
    fi
  done < <(grep -oE '\]\([^)]+\)' "$file" | sed -E 's/^\]\(//; s/\)$//' || true)
done <<< "$CHANGED_FILES"

if [ "$FAIL" -ne 0 ]; then
  echo "verify-docs.sh: FAILED" >&2
  exit 1
fi

echo "verify-docs.sh: PASSED"
