<template>
  <div class="mt-4">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <p class="mb-4">{{ getEditorTranslation('note') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>

    <Multiselect
      v-model="customerClassOptions"
      data-testid="b2b-customer-class-select"
      :options="customerClassesData"
      :placeholder="getEditorTranslation('placeholder')"
      label="name"
      track-by="id"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="false"
      :multiple="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import type { CustomerClassOption } from '../../customer-management/default-B2C-and-guest-customer-class/types';

const { updateSetting, getJsonSetting } = useSiteSettings('defaultB2BClassIds');
const { data: customerClassesData } = useCustomerClass();

const customerClassOptions = computed({
  get: () => {
    const selectedIds: string[] = getJsonSetting() || [];
    return customerClassesData.value?.filter((option) => selectedIds.includes(option.id)) || [];
  },
  set: (selectedOptions: CustomerClassOption[]) => {
    const ids = selectedOptions.map((option) => option.id);
    updateSetting(JSON.stringify(ids));
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "description": "Which customer classes should be assigned by default for B2B customers of the shop?",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label": "Default B2B customer classes",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "description": "Which customer classes should be assigned by default for B2B customers of the shop?",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label": "Default B2B customer classes",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
