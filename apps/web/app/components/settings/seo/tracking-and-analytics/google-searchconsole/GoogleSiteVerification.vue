<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="googleSiteVerification"
        type="text"
        data-testid="google-search-console-site-verification"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('googleSiteVerification');

const googleSiteVerification = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Google Search Console Site Verification",
    "placeholder": "Google Search Console Site Verification"
  },
  "de": {
    "label": "Google Search Console Site Verification",
    "placeholder": "Google Search Console Site Verification"
  }
}
</i18n>
