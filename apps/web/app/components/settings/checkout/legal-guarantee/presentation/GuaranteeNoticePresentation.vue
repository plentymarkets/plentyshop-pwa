<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <UiFormLabel for="guarantee-notice-display-mode">{{ getEditorTranslation('label') }}</UiFormLabel>
    <SfSelect
      id="guarantee-notice-display-mode"
      v-model="displayMode"
      data-testid="guarantee-notice-display-mode"
      class="w-full mt-2"
    >
      <option :value="GUARANTEE_NOTICE_DISPLAY_MODE.Modal">{{ getEditorTranslation('modal') }}</option>
      <option :value="GUARANTEE_NOTICE_DISPLAY_MODE.Inline">{{ getEditorTranslation('inline') }}</option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const { getSetting, updateSetting } = useSiteSettings(GUARANTEE_NOTICE_DISPLAY_MODE_SETTING);

const displayMode = computed({
  get: () =>
    getSetting() === GUARANTEE_NOTICE_DISPLAY_MODE.Inline
      ? GUARANTEE_NOTICE_DISPLAY_MODE.Inline
      : GUARANTEE_NOTICE_DISPLAY_MODE.Modal,
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Notice presentation",
    "description": "Choose how customers see the legal guarantee notice during checkout.",
    "modal": "Link that opens a dialog",
    "inline": "Show the notice directly"
  },
  "de": {
    "label": "Anzeige des Hinweises",
    "description": "Wähle aus, wie Kunden den Hinweis zur gesetzlichen Gewährleistung im Checkout sehen.",
    "modal": "Link öffnet ein Dialogfenster",
    "inline": "Hinweis direkt anzeigen"
  }
}
</i18n>
