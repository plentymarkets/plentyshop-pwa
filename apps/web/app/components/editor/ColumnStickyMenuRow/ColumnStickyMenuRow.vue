<template>
  <div class="px-3 py-2.5 border-b border-editor-border flex items-center justify-between gap-2">
    <span class="text-xs text-editor-text-subtle">{{ getEditorTranslation('sticky-on-scroll') }}</span>
    <SfSwitch
      :model-value="isSticky(props.columnIndex)"
      :data-testid="`actions-toggle-sticky-item-${props.index ?? props.columnIndex}`"
      class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      @update:model-value="toggleSticky(props.columnIndex)"
    />
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
import type { ColumnStickyMenuRowProps } from './types';

const props = defineProps<ColumnStickyMenuRowProps>();

const { isSticky, toggleSticky } = useColumnSticky(() => props.parentUuid);
</script>

<i18n lang="json">
{
  "en": {
    "sticky-on-scroll": "Sticky on scroll"
  },
  "de": {
    "sticky-on-scroll": "Sticky on scroll"
  }
}
</i18n>
