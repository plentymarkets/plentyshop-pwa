#!/usr/bin/env bash
#
# PlentyONE Shop CLI Code Generation Wrapper
# Simple pass-through wrapper for npx plentyshop generate
#
# Usage:
#   ./generate.sh <generator-type> <name> [options]
#
# Examples:
#   ./generate.sh component ProductCard
#   ./generate.sh composable useShoppingCart --skip-tests
#   ./generate.sh component ImageBlock --with-form
#   ./generate.sh component Settings --with-view --with-toolbar
#
# Options:
#   --skip-tests           Skip generating test files
#   --skip-types           Skip generating types.ts file
#   --with-form            Create additional *Form.vue file (for blocks)
#   --with-view            Create additional View.vue file (for settings)
#   --with-toolbar         Create additional ToolbarTrigger.vue file (for settings)
#   --dry-run              Preview planned files without writing anything

set -euo pipefail

# Validate minimum arguments
if [ $# -lt 2 ]; then
    echo "Error: Usage: ./generate.sh <generator-type> <name> [options]" >&2
    exit 1
fi

# Extract generator type and name
GENERATOR_TYPE="$1"
NAME="$2"
shift 2

# Pass all remaining arguments (flags) directly to the CLI
npx plentyshop generate "$GENERATOR_TYPE" "$NAME" "$@"

# Verify the expected output actually landed on disk, independent of the CLI's own exit code —
# a swallowed validation/action-building error can otherwise report success with zero files.
IS_DRY_RUN=false
for arg in "$@"; do
    if [ "$arg" = "--dry-run" ]; then
        IS_DRY_RUN=true
    fi
done

if [ "$IS_DRY_RUN" = false ]; then
    case "$GENERATOR_TYPE" in
        component)
            SEARCH_DIR="apps/web/app/components"
            MAIN_FILE_NAME="${NAME}.vue"
            ;;
        composable)
            SEARCH_DIR="apps/web/app/composables"
            MAIN_FILE_NAME="${NAME}.ts"
            ;;
        *)
            SEARCH_DIR=""
            MAIN_FILE_NAME=""
            ;;
    esac

    if [ -n "$SEARCH_DIR" ]; then
        MATCH=$(find "$SEARCH_DIR" -type f -path "*/${NAME}/${MAIN_FILE_NAME}" 2>/dev/null | head -n 1)
        if [ -z "$MATCH" ]; then
            echo "Error: generation reported success but no output file found matching ${SEARCH_DIR}/**/${NAME}/${MAIN_FILE_NAME}" >&2
            exit 1
        fi
    fi
fi