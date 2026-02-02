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

# Functions
error_exit() {
    echo "{\"success\": false, \"error\": \"$1\"}" >&2
    exit 1
}

success_msg() {
    echo "✓ $1" >&2
}

# Parse arguments
[ $# -lt 2 ] && error_exit "Usage: $0 <generator-type> <name> [options]"

GENERATOR_TYPE="$1"
NAME="$2"
WEB_APP_PATH=""
OUTPUT_PATH=""
SKIP_TESTS=false
SKIP_TYPES=false
WITH_FORM=false
WITH_VIEW=false
WITH_TOOLBAR=false

shift 2
while [ $# -gt 0 ]; do
    case "$1" in
        --web-app-path=*) WEB_APP_PATH="${1#*=}"; shift ;;
        --output-path=*) OUTPUT_PATH="${1#*=}"; shift ;;
        --skip-tests) SKIP_TESTS=true; shift ;;
        --skip-types) SKIP_TYPES=true; shift ;;
        --with-form) WITH_FORM=true; shift ;;
        --with-view) WITH_VIEW=true; shift ;;
        --with-toolbar) WITH_TOOLBAR=true; shift ;;
        *) shift ;;
    esac
done

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT" || error_exit "Failed to navigate to project root"

# Detect base path
if [ -n "$WEB_APP_PATH" ]; then
    BASE_PATH="$WEB_APP_PATH"
elif [ -f ".plentyone/shop-cli.json" ] && command -v jq &> /dev/null; then
    BASE_PATH=$(jq -r '.webAppPath // "apps/web/app"' .plentyone/shop-cli.json)
else
    BASE_PATH="apps/web/app"
fi

# Run generator
if [ -n "$WEB_APP_PATH" ]; then
    echo "$NAME" | npx plentyshop generate "$GENERATOR_TYPE" --web-app-path="$WEB_APP_PATH" > /dev/null 2>&1 || \
        error_exit "Generator failed"
else
    echo "$NAME" | npx plentyshop generate "$GENERATOR_TYPE" > /dev/null 2>&1 || \
        error_exit "Generator failed"
fi

# Determine directories
case "$GENERATOR_TYPE" in
    component)
        SRC_DIR="$BASE_PATH/components/$NAME"
        ;;
    composable)
        SRC_DIR="$BASE_PATH/composables/$NAME"
        ;;
    *)
        error_exit "Invalid generator type: $GENERATOR_TYPE"
        ;;
esac

# Move to custom output path if specified
if [ -n "$OUTPUT_PATH" ]; then
    DEST_DIR="$BASE_PATH/$OUTPUT_PATH/$NAME"
    mkdir -p "$(dirname "$DEST_DIR")"
    mv "$SRC_DIR" "$DEST_DIR" || error_exit "Failed to move files"
    COMPONENT_DIR="$DEST_DIR"
else
    COMPONENT_DIR="$SRC_DIR"
fi

# Collect created files
CREATED_FILES=()
for file in "$COMPONENT_DIR"/**/*; do
    [ -f "$file" ] && CREATED_FILES+=("$file")
done

# Post-processing: Remove optional files
if [ "$SKIP_TESTS" = true ]; then
    rm -rf "$COMPONENT_DIR/__tests__"
    success_msg "Skipped test file generation"
fi

if [ "$SKIP_TYPES" = true ]; then
    rm -f "$COMPONENT_DIR/types.ts"
    success_msg "Skipped types file generation"
fi

# Post-processing: Create additional files
if [ "$WITH_FORM" = true ] && [ "$GENERATOR_TYPE" = "component" ]; then
    FORM_FILE="$COMPONENT_DIR/${NAME}Form.vue"
    cat > "$FORM_FILE" << 'FORM_TEMPLATE'
<template>
  <div class="form-container">
    <p>{{ getEditorTranslation('form-placeholder') }}</p>
  </div>
</template>

<script setup lang="ts">
// Editor form component
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
    success_msg "Created ${NAME}Form.vue"
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
    success_msg "Created View.vue"
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
    >
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
    success_msg "Created ToolbarTrigger.vue"
fi

# Refresh file list after modifications
CREATED_FILES=()
for file in "$COMPONENT_DIR"/**/*; do
    [ -f "$file" ] && CREATED_FILES+=("$file")
done

# Output JSON
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