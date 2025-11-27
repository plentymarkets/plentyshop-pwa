<template>
  <div class="py-2">
    <div class="flex justify-between">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('full-width') }}</UiFormLabel>
      <SfSwitch
        :model-value="modelValue"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
import type { FullWidthToggleProps } from './types';

defineProps<FullWidthToggleProps>();

const emit = defineEmits(['update:modelValue']);
</script>

<i18n lang="json">
{
  "en": {
    "full-width": "Enable full width"
  },
  "de": {
    "full-width": "Volle Breite aktivieren"
  }
}
</i18n>
