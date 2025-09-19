<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
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
    "description": "",
    "placeholder": ""
  },
  "de": {
    "label": "Enter ID from variation property of the type text or date for price validity",
    "description": "",
    "placeholder": ""
  }
}
</i18n>
