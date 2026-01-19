<template>
  <div class="py-2 flex flex-col">
    <span class="mb-2">
      {{ getEditorTranslation('description') }}
    </span>
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-2">
        <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
        <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'right'" class="z-[9999]">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>
      <SfSwitch
        v-model="showNotifyMeFeature"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch, SfTooltip, SfIconInfo } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('showNotifyMe');

const showNotifyMeFeature = computed({
  get: () => !!getSetting(),
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Enable notify me",
    "description": "Allow customers to subscribe to back-in-stock notifications on item pages",
    "tooltip": "Displays a subscription button on the item page of sold-out items so customers can sign up for availability notifications. To function correctly, corresponding email templates and an email account must be configured. See the documentation for more information."
  },
  "de": {
    "label": "Benachrichtigungs-Formular aktivieren",
    "description": "Gibt Kunden die Möglichkeit, sich auf Artikelseiten für Benachrichtigungen über die Wiederverfügbarkeit einzuschreiben",
    "tooltip": "Zeigt auf der Artikelseite ausverkaufter Artikel einen Abonnement-Button an, über den sich Kund:innen für Verfügbarkeitsbenachrichtigungen anmelden können. Für die korrekte Funktion müssen verbundene E-Mail-Vorlagen sowie ein E-Mail-Konto konfiguriert sein. Weitere Informationen findest du in der Dokumentation."
  }
}
</i18n>
