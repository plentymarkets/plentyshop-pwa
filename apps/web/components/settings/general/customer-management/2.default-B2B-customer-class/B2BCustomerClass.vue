<template>
  <div class="mt-4">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <p class="mb-4">{{ getEditorTranslation('note') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>

    <Multiselect
      v-model="customerClassOption"
      data-testid="b2b-customer-class-select"
      :options="customerClassesData"
      :placeholder="getEditorTranslation('placeholder')"
      label="name"
      track-by="id"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { CustomerClassOption } from '../1.default-B2C-and-guest-customer-class/types';

const { updateSetting, getSetting } = useSiteSettings('defaultB2BCustomerClass');
const { fetchCustomerClasses, data: customerClassesData } = useCustomerClass();

const customerClassOption = computed({
  get: () => {
    return customerClassesData.value.find((o: CustomerClassOption) => o.id === getSetting());
  },
  set: (option) => {
    updateSetting(option?.id ?? '');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "description": "Which customer class should be assigned by default for B2B customers of the shop?",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label": "Default B2B customer class",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "description": "Which customer class should be assigned by default for B2B customers of the shop?",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label": "Default B2B customer class",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
