<template>
  <div class="flex-none px-6 pt-5 pb-4 border-b border-editor-border">
    <div class="flex items-center justify-between">
      <div class="text-lg font-bold text-editor-text-strong">{{ getEditorTranslation('label') }}</div>
      <button
        type="button"
        class="w-8 h-8 rounded-lg border-0 bg-transparent text-editor-text-muted flex items-center justify-center hover:bg-editor-surface"
        data-testid="version-history-close"
        :aria-label="getEditorTranslation('close-label')"
        @click="closeDrawer"
      >
        <SfIconClose />
      </button>
    </div>
    <div class="mt-1 text-xs text-editor-text-muted">{{ getEditorTranslation('description') }}</div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { closeDrawer } = useBlockSnapshots();
</script>

<i18n lang="json">
{
  "en": {
    "label": "Version history",
    "close-label": "Close",
    "description": "Restoring a version replaces the current content of this page."
  },
  "de": {
    "label": "Version history",
    "close-label": "Close",
    "description": "Restoring a version replaces the current content of this page."
  }
}
</i18n>
