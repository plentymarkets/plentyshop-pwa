<template>
  <div class="mt-4">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <p class="mb-4">{{ getEditorTranslation('note') }}</p>

    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label-default-b2b-class') }}</UiFormLabel>
    </div>
    <Multiselect
      v-model="defaultClassOptions"
      data-testid="b2b-customer-class-select"
      :options="customerClassesData"
      :placeholder="getEditorTranslation('placeholder-b2b-classes')"
      label="name"
      track-by="id"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="true"
      :multiple="false"
    />

    <div class="flex justify-between mt-4 mb-2">
      <UiFormLabel>{{ getEditorTranslation('label-b2b-classes') }}</UiFormLabel>
    </div>
    <Multiselect
      v-model="customerClassOptions"
      data-testid="b2b-customer-class-select"
      :options="customerClassesData"
      :placeholder="getEditorTranslation('placeholder-b2b-classes')"
      label="name"
      track-by="id"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="true"
      :multiple="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import type { CustomerClassOption } from '../../customer-management/default-B2C-and-guest-customer-class/types';

const { updateSetting: updateDefaultB2BClassId, getNumberSetting: getDefaultB2BClassId } =
  useSiteSettings('defaultCustomerB2BClassId');
const { updateSetting, getJsonSetting } = useSiteSettings('allCustomerB2BClassIds');

const { data: customerClassesData } = useCustomerClass();

const defaultClassOptions = computed({
  get: () => {
    const selectedId: number = getDefaultB2BClassId() || -1;
    return customerClassesData.value?.filter((option) => option.id.toString() === selectedId.toString()) || [];
  },
  set: (selectedOption?: CustomerClassOption) => {
    updateDefaultB2BClassId(selectedOption?.id ?? -1);
  },
});
const customerClassOptions = computed({
  get: () => {
    const selectedIds: string[] = getJsonSetting('[]') || [];
    console.log(selectedIds);
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
    "label-default-b2b-class": "Default B2B customer class",
    "placeholder-default-b2b-class": "Select the default B2B class",
    "label-b2b-classes": "B2B customer classes",
    "placeholder-b2b-classes": "Select all B2B customer classes",
    "deselect-label": "Selected"
  },
  "de": {
    "description": "Which customer classes should be assigned by default for B2B customers of the shop?",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label-default-b2b-class": "Default B2B customer class",
    "placeholder-default-b2b-class": "Select the default B2B class",
    "label-b2b-classes": "B2B customer classes",
    "placeholder-b2b-classes": "Select all B2B customer classes",
    "deselect-label": "Selected"
  }
}
</i18n>
