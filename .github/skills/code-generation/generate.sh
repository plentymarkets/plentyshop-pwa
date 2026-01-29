#!/usr/bin/env bash
#
# PlentyONE Shop CLI Code Generation Wrapper
# Non-interactive wrapper for npx plentyshop generate
#
# Usage:
#   ./generate.sh <generator-type> <name> [options]
#
# Examples:
#   ./generate.sh component ProductCard
#   ./generate.sh composable useShoppingCart
#   ./generate.sh component ImageBlock --output-path=components/blocks
#   ./generate.sh component MySettings --output-path=components/settings/general
#
# Options:
#   --web-app-path=path    Override the base web app path (default: apps/web/app)
#   --output-path=path     Specify a custom output subdirectory (e.g., components/blocks)
#   --skip-tests           Skip generating test files
#   --skip-types           Skip generating types.ts file
#   --with-form            Create additional *Form.vue file (for blocks)
#   --with-view            Create additional View.vue file (for settings)
#   --with-toolbar         Create additional ToolbarTrigger.vue file (for settings)

set -euo pipefail

# Trap to cleanup on error
cleanup_on_error() {
    if [ -n "${TEMP_COMPONENT_DIR:-}" ] && [ -d "$TEMP_COMPONENT_DIR" ]; then
        warning_msg "Cleaning up partial generation due to error..."
        rm -rf "$TEMP_COMPONENT_DIR"
    fi
}
trap cleanup_on_error ERR

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print error and exit
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    echo "{\"success\": false, \"error\": \"$1\"}"
    exit 1
}

# Function to print success message
success_msg() {
    echo -e "${GREEN}✓ $1${NC}" >&2
}

# Function to print warning message
warning_msg() {
    echo -e "${YELLOW}⚠ $1${NC}" >&2
}

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    error_exit "Usage: $0 <generator-type> <name> [--web-app-path=path]"
fi

GENERATOR_TYPE="$1"
NAME="$2"
WEB_APP_PATH=""
OUTPUT_PATH=""
SKIP_TESTS=false
SKIP_TYPES=false
WITH_FORM=false
WITH_VIEW=false
WITH_TOOLBAR=false

# Parse optional arguments
shift 2
while [ $# -gt 0 ]; do
    case "$1" in
        --web-app-path=*)
            WEB_APP_PATH="${1#*=}"
            shift
            ;;
        --output-path=*)
            OUTPUT_PATH="${1#*=}"
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-types)
            SKIP_TYPES=true
            shift
            ;;
        --with-form)
            WITH_FORM=true
            shift
            ;;
        --with-view)
            WITH_VIEW=true
            shift
            ;;
        --with-toolbar)
            WITH_TOOLBAR=true
            shift
            ;;
        *)
            warning_msg "Unknown option: $1"
            shift
            ;;
    esac
done

# Validate generator type
case "$GENERATOR_TYPE" in
    component|composable)
        # Valid generator types
        ;;
    *)
        error_exit "Invalid generator type: $GENERATOR_TYPE. Must be 'component' or 'composable'"
        ;;
esac

# Validate output path if provided
if [ -n "$OUTPUT_PATH" ]; then
    # Check for directory traversal attempts
    if [[ "$OUTPUT_PATH" == *".."* ]]; then
        error_exit "Invalid output path: directory traversal (..) not allowed"
    fi

    # Check for absolute paths
    if [[ "$OUTPUT_PATH" == /* ]]; then
        error_exit "Invalid output path: absolute paths not allowed, use relative paths only"
    fi

    # Check for invalid characters (only allow alphanumeric, dash, underscore, forward slash)
    if [[ ! "$OUTPUT_PATH" =~ ^[a-zA-Z0-9/_-]+$ ]]; then
        error_exit "Invalid output path: only alphanumeric characters, dashes, underscores, and forward slashes allowed"
    fi

    # Validate against allowed path prefixes (security whitelist)
    ALLOWED_PREFIXES=(
        "components"
        "composables"
        "pages"
        "layouts"
        "middleware"
        "plugins"
        "utils"
        "server"
    )

    VALID_PREFIX=false
    for prefix in "${ALLOWED_PREFIXES[@]}"; do
        if [[ "$OUTPUT_PATH" == "$prefix" ]] || [[ "$OUTPUT_PATH" == "$prefix/"* ]]; then
            VALID_PREFIX=true
            break
        fi
    done

    if [ "$VALID_PREFIX" = false ]; then
        error_exit "Invalid output path: must start with one of: ${ALLOWED_PREFIXES[*]}"
    fi
fi

# Validate name format (basic check - CLI will do more thorough validation)
if [[ ! "$NAME" =~ ^[a-zA-Z][a-zA-Z0-9]*$ ]]; then
    error_exit "Invalid name format: must start with letter and contain only alphanumeric characters"
fi

# Additional security: Ensure NAME doesn't contain any special shell or HTML characters
# This protects against injection in generated templates
if [[ "$NAME" =~ [^a-zA-Z0-9] ]]; then
    error_exit "Invalid name: contains special characters that could cause security issues"
fi

# Additional validation for naming conventions
case "$GENERATOR_TYPE" in
    component)
        # Component should be PascalCase (start with uppercase)
        if [[ ! "$NAME" =~ ^[A-Z] ]]; then
            error_exit "Invalid component name: must be PascalCase (start with uppercase letter)"
        fi
        ;;
    composable)
        # Composable should start with 'use' and be camelCase
        if [[ ! "$NAME" =~ ^use[A-Z] ]]; then
            error_exit "Invalid composable name: must start with 'use' followed by PascalCase (e.g., useShoppingCart)"
        fi
        ;;
esac

# Check if npx is available
if ! command -v npx &> /dev/null; then
    error_exit "npx command not found. Please ensure Node.js is installed."
fi

# Navigate to project root (script location is .github/skills/code-generation/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT" || error_exit "Failed to navigate to project root"

# Detect default or configured web app path
if [ -n "$WEB_APP_PATH" ]; then
    BASE_PATH="$WEB_APP_PATH"
elif [ -f ".plentyone/shop-cli.json" ]; then
    # Try to read from config file if jq is available
    if command -v jq &> /dev/null; then
        BASE_PATH=$(jq -r '.webAppPath // "apps/web/app"' .plentyone/shop-cli.json)
    else
        BASE_PATH="apps/web/app"
    fi
else
    BASE_PATH="apps/web/app"
fi

# Determine expected file paths based on generator type and output path
declare -a EXPECTED_FILES
if [ -n "$OUTPUT_PATH" ]; then
    # Custom output path specified (e.g., for blocks or settings)
    case "$GENERATOR_TYPE" in
        component)
            EXPECTED_FILES=(
                "$BASE_PATH/$OUTPUT_PATH/$NAME/$NAME.vue"
                "$BASE_PATH/$OUTPUT_PATH/$NAME/types.ts"
                "$BASE_PATH/$OUTPUT_PATH/$NAME/__tests__/$NAME.spec.ts"
            )
            ;;
        composable)
            EXPECTED_FILES=(
                "$BASE_PATH/$OUTPUT_PATH/$NAME/$NAME.ts"
                "$BASE_PATH/$OUTPUT_PATH/$NAME/types.ts"
                "$BASE_PATH/$OUTPUT_PATH/$NAME/index.ts"
                "$BASE_PATH/$OUTPUT_PATH/$NAME/__tests__/$NAME.spec.ts"
            )
            ;;
    esac
else
    # Default paths
    case "$GENERATOR_TYPE" in
        component)
            EXPECTED_FILES=(
                "$BASE_PATH/components/$NAME/$NAME.vue"
                "$BASE_PATH/components/$NAME/types.ts"
                "$BASE_PATH/components/$NAME/__tests__/$NAME.spec.ts"
            )
            ;;
        composable)
            EXPECTED_FILES=(
                "$BASE_PATH/composables/$NAME/$NAME.ts"
                "$BASE_PATH/composables/$NAME/types.ts"
                "$BASE_PATH/composables/$NAME/index.ts"
                "$BASE_PATH/composables/$NAME/__tests__/$NAME.spec.ts"
            )
            ;;
    esac
fi

# Check if any expected files already exist
for file in "${EXPECTED_FILES[@]}"; do
    if [ -f "$file" ]; then
        error_exit "File already exists: $file"
    fi
done

# If custom output path is specified, we need to move files after generation
TEMP_MOVE_NEEDED=false
if [ -n "$OUTPUT_PATH" ]; then
    TEMP_MOVE_NEEDED=true
fi

# Run the generator non-interactively by piping the name
# NOTE: Using command substitution instead of eval for security
if [ -n "$WEB_APP_PATH" ]; then
    echo "$NAME" | npx plentyshop generate "$GENERATOR_TYPE" --web-app-path="$WEB_APP_PATH" > /dev/null 2>&1 || {
        error_exit "Generator failed. Check if name format is valid and CLI is properly installed."
    }
else
    echo "$NAME" | npx plentyshop generate "$GENERATOR_TYPE" > /dev/null 2>&1 || {
        error_exit "Generator failed. Check if name format is valid and CLI is properly installed."
    }
fi

# Track the component directory for cleanup if needed
if [ -n "$OUTPUT_PATH" ]; then
    TEMP_COMPONENT_DIR="$BASE_PATH/components/$NAME"
else
    TEMP_COMPONENT_DIR=""
fi

# Move files to custom output path if needed
if [ "$TEMP_MOVE_NEEDED" = true ]; then
    case "$GENERATOR_TYPE" in
        component)
            SRC_DIR="$BASE_PATH/components/$NAME"
            DEST_DIR="$BASE_PATH/$OUTPUT_PATH/$NAME"
            ;;
        composable)
            SRC_DIR="$BASE_PATH/composables/$NAME"
            DEST_DIR="$BASE_PATH/$OUTPUT_PATH/$NAME"
            ;;
    esac

    # Create destination directory if it doesn't exist
    mkdir -p "$(dirname "$DEST_DIR")"

    # Move the generated files
    if [ -d "$SRC_DIR" ]; then
        if ! mv "$SRC_DIR" "$DEST_DIR"; then
            error_exit "Failed to move generated files from $SRC_DIR to $DEST_DIR"
        fi
        # Clear temp tracking since move was successful
        TEMP_COMPONENT_DIR=""
    else
        error_exit "Expected source directory $SRC_DIR was not created"
    fi
fi

# Verify files were created
CREATED_FILES=()
for file in "${EXPECTED_FILES[@]}"; do
    if [ -f "$file" ]; then
        CREATED_FILES+=("$file")
    fi
done

if [ ${#CREATED_FILES[@]} -eq 0 ]; then
    error_exit "No files were created. Generator may have failed silently."
fi

# Determine the final component directory
if [ -n "$OUTPUT_PATH" ]; then
    COMPONENT_DIR="$BASE_PATH/$OUTPUT_PATH/$NAME"
else
    case "$GENERATOR_TYPE" in
        component)
            COMPONENT_DIR="$BASE_PATH/components/$NAME"
            ;;
        composable)
            COMPONENT_DIR="$BASE_PATH/composables/$NAME"
            ;;
    esac
fi

# Post-processing: Remove files if --skip flags are used
SKIPPED_FILES=()

if [ "$SKIP_TESTS" = true ]; then
    TEST_FILE="$COMPONENT_DIR/__tests__/$NAME.spec.ts"
    TEST_DIR="$COMPONENT_DIR/__tests__"
    if [ -f "$TEST_FILE" ]; then
        rm -f "$TEST_FILE"
        if [ -d "$TEST_DIR" ] && [ -z "$(ls -A "$TEST_DIR" 2>/dev/null)" ]; then
            rmdir "$TEST_DIR"
        fi
        SKIPPED_FILES+=("$TEST_FILE")
        success_msg "Skipped test file generation"
    fi
fi

if [ "$SKIP_TYPES" = true ]; then
    TYPES_FILE="$COMPONENT_DIR/types.ts"
    if [ -f "$TYPES_FILE" ]; then
        rm -f "$TYPES_FILE"
        SKIPPED_FILES+=("$TYPES_FILE")
        success_msg "Skipped types file generation"
    fi
fi

# Remove skipped files from CREATED_FILES array properly
if [ ${#SKIPPED_FILES[@]} -gt 0 ]; then
    TEMP_FILES=()
    for file in "${CREATED_FILES[@]}"; do
        SKIP_FILE=false
        for skipped in "${SKIPPED_FILES[@]}"; do
            if [ "$file" = "$skipped" ]; then
                SKIP_FILE=true
                break
            fi
        done
        if [ "$SKIP_FILE" = false ] && [ -n "$file" ]; then
            TEMP_FILES+=("$file")
        fi
    done
    CREATED_FILES=("${TEMP_FILES[@]}")
fi

# Post-processing: Create additional files if requested
if [ "$WITH_FORM" = true ] && [ "$GENERATOR_TYPE" = "component" ]; then
    FORM_FILE="$COMPONENT_DIR/${NAME}Form.vue"
    cat > "$FORM_FILE" << 'FORM_TEMPLATE'
<template>
  <div class="form-container">
    <!-- Form configuration for editor goes here -->
    <p>{{ getEditorTranslation('form-placeholder') }}</p>
  </div>
</template>

<script setup lang="ts">
// Editor form component - uses getEditorTranslation() for admin translations
</script>

<i18n lang="json">
{
  "en": {
    "form-placeholder": "Configure your block settings here"
  }
}
</i18n>
FORM_TEMPLATE
    CREATED_FILES+=("$FORM_FILE")
    success_msg "Created ${NAME}Form.vue for editor configuration"
fi

if [ "$WITH_VIEW" = true ] && [ "$GENERATOR_TYPE" = "component" ]; then
    VIEW_FILE="$COMPONENT_DIR/View.vue"
    cat > "$VIEW_FILE" << 'VIEW_TEMPLATE'
<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('settings-title') }}</template>

    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "settings-title": "Settings Panel",
    "description": "Configure settings here"
  }
}
</i18n>
VIEW_TEMPLATE
    CREATED_FILES+=("$VIEW_FILE")
    success_msg "Created View.vue for settings panel"
fi

if [ "$WITH_TOOLBAR" = true ] && [ "$GENERATOR_TYPE" = "component" ]; then
    TOOLBAR_FILE="$COMPONENT_DIR/ToolbarTrigger.vue"
    cat > "$TOOLBAR_FILE" << 'TOOLBAR_TEMPLATE'
<template>
  <SfTooltip
    :label="getEditorTranslation('tooltip')"
    placement="right"
    class="inline-grid font-editor"
    :show-arrow="true"
  >
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      data-testid="toolbar-trigger"
    >
      <!-- Add icon here -->
      <span>{{ active ? '✓' : '○' }}</span>
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Open settings"
  }
}
</i18n>
TOOLBAR_TEMPLATE
    CREATED_FILES+=("$TOOLBAR_FILE")
    success_msg "Created ToolbarTrigger.vue for settings toolbar"
fi

# Output success JSON
echo "{"
echo "  \"success\": true,"
echo "  \"generator\": \"$GENERATOR_TYPE\","
echo "  \"name\": \"$NAME\","
echo "  \"files\": ["
for i in "${!CREATED_FILES[@]}"; do
    if [ "$i" -eq $((${#CREATED_FILES[@]} - 1)) ]; then
        echo "    \"${CREATED_FILES[$i]}\""
    else
        echo "    \"${CREATED_FILES[$i]}\","
    fi
done
echo "  ]"
echo "}"

success_msg "Successfully generated $GENERATOR_TYPE: $NAME"
success_msg "Created ${#CREATED_FILES[@]} files"
