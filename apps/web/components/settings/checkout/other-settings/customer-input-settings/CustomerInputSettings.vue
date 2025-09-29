<template>
  <div class="py-2 flex flex-col">
    <span class="mb-2">
      {{ getEditorTranslation('description') }}
    </span>
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfSwitch
        v-model="showCustomerWishComponent"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('showCustomerWishComponent');

const showCustomerWishComponent = computed({
  get: () => getSetting() === 'true',
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Customer Wish Input",
    "description": "Toggle to show or hide the Customer Wish field during checkout."
  },
  "de": {
    "label": "Customer Wish Input",
    "description": "Schaltet das Kundenwunsch-Feld im Checkout ein oder aus."
  }
}
</i18n>
