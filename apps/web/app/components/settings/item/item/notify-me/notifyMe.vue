<template>
  <div class="py-2 flex flex-col">
    <span class="mb-2">
      {{ getEditorTranslation('description') }}
    </span>
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfSwitch
        v-model="showNotifyMeFeature"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('showNotifyMe');

const showNotifyMeFeature = computed({
  get: () => !!getSetting(),
  set: (value) => updateSetting((!value).toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Enable notify me form",
    "description": "Do you want to give customers the option to sign up for notifications when an item is back in stock?"
  },
  "de": {
    "label": "Benachrichtigungs-Formular aktivieren",
    "description": "Möchten Sie Kunden die Möglichkeit geben, sich für Benachrichtigungen anzumelden, sobald ein Artikel wieder verfügbar ist?"
  }
}
</i18n>
