<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="contactEmail" type="text" data-testid="contact-email" />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('contactShopEmail');

const contactEmail = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Contact Form Email",
    "tooltip": "Enter the email address to which messages from the contact form should be sent."
  },
  "de": {
    "label": "Contact Form Email",
    "tooltip": "Geben Sie die E-Mail-Adresse ein, an die Nachrichten aus dem Kontaktformular gesendet werden sollen."
  }
}
</i18n>
