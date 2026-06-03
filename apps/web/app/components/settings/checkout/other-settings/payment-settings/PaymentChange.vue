<template>
  <div class="py-2 flex flex-col">
    <span class="mb-2">
      {{ getEditorTranslation('description') }}
    </span>
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfSwitch
        v-model="useOrderChangePaymentMethod"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('enableOrderChangePaymentMethod');

const useOrderChangePaymentMethod = computed({
  get: () => !!getSetting(),
  set: (value) => updateSetting((!!value).toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Allow customers to change payment method afterwards",
    "description": "Do you want to allow customers to change their payment method afterwards? This setting enables customers to modify their payment method after the checkout process."
  },
  "de": {
    "label": "Allow customers to change payment method afterwards",
    "description": "Do you want to allow customers to change their payment method afterwards? This setting enables customers to modify their payment method after the checkout process."
  }
}
</i18n>
