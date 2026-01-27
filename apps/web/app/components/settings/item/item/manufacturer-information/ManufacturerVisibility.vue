<template>
  <div class="py-2 space-y-3">
    <div class="flex justify-between items-center mb-2 gap-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'left'" class="z-[9999]">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <div v-for="setting in settings" :key="setting" class="flex items-center justify-between">
      <UiFormLabel class="mb-0">
        {{ getEditorTranslation(`${setting}.label`) }}
      </UiFormLabel>
      <SfSwitch
        v-model="localSettings[setting]"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

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

const localSettings = reactive<Record<string, boolean>>({});

settings.forEach((key) => {
  const { updateSetting, getSetting } = useSiteSettings(key);

  localSettings[key] = parseInt(getSetting()) === 1;

  watch(
    () => localSettings[key],
    (newValue) => {
      updateSetting(newValue ? '1' : '0');
    },
  );
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Use the toggles to enable which manufacturer information should be shown on item pages.",
    "tooltip": "Control which manufacturer details are visible to customers when they access the legal information drawer on the item page.",
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
    "label": "Use the toggles to enable which manufacturer information should be shown on item pages.",
    "tooltip": "Control which manufacturer details are visible to customers when they access the legal information drawer on the item page.",
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
