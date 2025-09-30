<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="seoRichSnippetIdForPriceValidity"
        :placeholder="getEditorTranslation('placeholder')"
        type="text"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetIdForPriceValidity');

const seoRichSnippetIdForPriceValidity = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Enter ID from variation property of the type text or date for price validity",
    "placeholder": ""
  },
  "de": {
    "label": "Enter ID from variation property of the type text or date for price validity",
    "placeholder": ""
  }
}
</i18n>
