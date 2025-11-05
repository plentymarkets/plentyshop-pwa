<template>
  <div class="py-2 space-y-3">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <div v-for="setting in settings" :key="setting" class="flex items-center justify-between">
      <UiFormLabel class="mb-0">
        {{ getEditorTranslation(`${setting}.label`) }}
      </UiFormLabel>
      <SfSwitch
        v-model="settingValues[setting]"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const settings = [
  'manufacturerName',
  'manufacturerExternalName',
  'manufacturerLegalName',
  'manufacturerLogo',
  'manufacturerUrl',
  'manufacturerStreet',
  'manufacturerHouseNo',
  'manufacturerPostcode',
  'manufacturerTown',
  'manufacturerCountryId',
  'manufacturerPhoneNumber',
  'manufacturerFaxNumber',
  'manufacturerEmail',
  'manufacturerContactUrl',
];

const settingValues = reactive({});

settings.forEach((key) => {
  const { updateSetting, getSetting } = useSiteSettings(key);

  settingValues[key] = computed({
    get: () => getSetting() === '1',
    set: (value) => updateSetting(value ? '1' : '0'),
  });
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Check the boxes of the manufacturer information you want to display on the item view.",
    "description": "Control how item information is presented.",
    "manufacturerName.label": "Manufacturer Name",
    "manufacturerExternalName.label": "Manufacturer External Name",
    "manufacturerLegalName.label": "Manufacturer Legal Name",
    "manufacturerLogo.label": "Manufacturer Logo",
    "manufacturerUrl.label": "Manufacturer URL",
    "manufacturerStreet.label": "Manufacturer Street",
    "manufacturerHouseNo.label": "Manufacturer House No.",
    "manufacturerPostcode.label": "Manufacturer Postcode",
    "manufacturerTown.label": "Manufacturer Town",
    "manufacturerCountryId.label": "Manufacturer Country ID",
    "manufacturerPhoneNumber.label": "Manufacturer Phone Number",
    "manufacturerFaxNumber.label": "Manufacturer Fax Number",
    "manufacturerEmail.label": "Manufacturer Email",
    "manufacturerContactUrl.label": "Manufacturer Contact URL"
  },
  "de": {
    "label": "Check the boxes of the manufacturer information you want to display on the item view.",
    "description": "Control how item information is presented.",
    "manufacturerName.label": "Manufacturer Name",
    "manufacturerExternalName.label": "Manufacturer External Name",
    "manufacturerLegalName.label": "Manufacturer Legal Name",
    "manufacturerLogo.label": "Manufacturer Logo",
    "manufacturerUrl.label": "Manufacturer URL",
    "manufacturerStreet.label": "Manufacturer Street",
    "manufacturerHouseNo.label": "Manufacturer House No.",
    "manufacturerPostcode.label": "Manufacturer Postcode",
    "manufacturerTown.label": "Manufacturer Town",
    "manufacturerCountryId.label": "Manufacturer Country ID",
    "manufacturerPhoneNumber.label": "Manufacturer Phone Number",
    "manufacturerFaxNumber.label": "Manufacturer Fax Number",
    "manufacturerEmail.label": "Manufacturer Email",
    "manufacturerContactUrl.label": "Manufacturer Contact URL"
  }
}
</i18n>
