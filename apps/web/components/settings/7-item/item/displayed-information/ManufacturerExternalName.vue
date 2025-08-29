<template>
    <div class="flex row">
      <SfCheckbox
        v-model="manufacturerExternalName"
        data-testid="font-select"
        :placeholder="getEditorTranslation('placeholder')"
        class="cursor-pointer"
        :deselect-label="getEditorTranslation('deselect-label')"
        :multiple="true"
      />
      <UiFormLabel class="ml-2">
        {{ getEditorTranslation('label') }}
        <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </UiFormLabel>
    </div>
  </template>
  
<script setup lang="ts">
import { SfCheckbox } from '@storefront-ui/vue';
// const options = ref(['All', 'External name', 'Name', 'Logo URL', 'Homepage', 'Street', 'House No.', 'Postcode', 'Town', 'Country', 'Telephone number', 'Fax number', 'Email', 'Legal name', 'Contact form']);
  
const { updateSetting, getSetting } = useSiteSettings('manufacturerExternalName');

const manufacturerExternalName = computed({
  get: () => getSetting() === '1',
  set: (value) => updateSetting(value.toString()),
});
</script>
  
<i18n lang="json">
{
  "en": {
    "label": "Manufacturer external name",
    "tooltip": "",
    "placeholder": "Select",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Manufacturer external name",
    "tooltip": "",
    "placeholder": "Select",
    "deselect-label": "Selected"
  }
}
</i18n>
  