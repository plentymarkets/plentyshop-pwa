<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">VAT number validation</UiFormLabel>
      <SfSwitch
        v-model="useVatNumberValidation"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <span>
      Do you want to check the validity of your customers’ VAT number? The VAT number is checked whenever an address is
      changed and upon completion of an order. The validation is carried out via the external service VIES. You can also
      determine which status an order should have if its VAT number cannot be validated if the service cannot be
      reached.
    </span>
  </div>
</template>
<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('vatNumberValidation');

const useVatNumberValidation = computed({
  get: () => getSetting() === 'true',
  set: (value) => updateSetting(value.toString()),
});
</script>
