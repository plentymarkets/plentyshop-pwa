<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1"
        >Validate Vat Number?
        <SfTooltip
          label="Automatically convert item images to modern formats for reduced file size and faster loading. This may increase cloud storage costs but can lower traffic expenses."
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
        >
          <SfIconInfo :size="'sm'" /> </SfTooltip
      ></UiFormLabel>
      <SfSwitch
        v-model="useVatNumberValidation"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <span class="typography-text-xs text-neutral-700"
      >Do you want to check the validity of your customers’ VAT number? The VAT number is checked whenever an address is changed and upon completion of an order. The validation is carried out via the external service VIES.
      Label: Validate VAT Number
    </span>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('VatNumberValidation');

const useVatNumberValidation = computed({
  get: () => getSetting() === 'true',
  set: (value) => updateSetting(value.toString()),
});
</script>
