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
#   --output-path=path     Custom output path (default: apps/web/app)
#   --skip-tests           Skip generating test files
#   --skip-types           Skip generating types.ts file
#   --with-form            Create additional *Form.vue file (for blocks)
#   --with-view            Create additional View.vue file (for settings)
#   --with-toolbar         Create additional ToolbarTrigger.vue file (for settings)

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