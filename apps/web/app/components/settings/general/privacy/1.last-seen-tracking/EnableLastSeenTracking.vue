<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>

    <EditorAdmonitionWarning
      class="my-4"
      data-testid="privacy-last-seen-tracking-legal-hint"
      :title="getEditorTranslation('hint-title')"
      :message="getEditorTranslation('hint')"
    />

    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">
        {{ getEditorTranslation('label') }}
      </UiFormLabel>
      <SfSwitch
        v-model="enableLastSeenTracking"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getBooleanSetting } = useSiteSettings('enableLastSeenTracking');

const enableLastSeenTracking = computed({
  get: () => getBooleanSetting(),
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Track last seen products",
    "description": "Track products a customer has recently viewed so they can be shown as recommendations in the corresponding product recommendation source.",
    "hint": "When enabled, products are tracked based on the customer's last seen activity and this information is temporarily stored server-side on the session. Enabling this setting may require updates to the website's privacy policy. Whether legitimate interest (Art. 6(1)(f) GDPR) can serve as the legal basis shall be independently verified.",
    "hint-title": "Legal compliance"
  },
  "de": {
    "label": "Track last seen products",
    "description": "Track products a customer has recently viewed so they can be shown as recommendations in the corresponding product recommendation source.",
    "hint": "When enabled, products are tracked based on the customer's last seen activity and this information is temporarily stored server-side on the session. Enabling this setting may require updates to the website's privacy policy. Whether legitimate interest (Art. 6(1)(f) GDPR) can serve as the legal basis shall be independently verified.",
    "hint-title": "Legal compliance"
  }
}
</i18n>
