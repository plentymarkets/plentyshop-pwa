<template>
  <div class="py-2">
    <div class="flex justify-between">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('full-width') }}</UiFormLabel>
      <SfSwitch
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
</script>

<i18n lang="json">
{
  "en": {
    "full-width": "Enable full width"
  },
  "de": {
    "full-width": "Enable full width"
  }
}
</i18n>
