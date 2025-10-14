<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <SfInput
      v-model="seoRichSnippetIdForPriceValidity"
      :placeholder="getEditorTranslation('placeholder')"
      type="text"
      data-testid="seo-id-for-price-validity"
    />
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
    "label": "Select source for price validity in Rich Snippets of the item page",
    "placeholder": "Enter ID from variation property of the type text for price validity",
  },
  "de": {
    "label": "Select source for price validity in Rich Snippets of the item page",
    "placeholder": "Enter ID from variation property of the type text for price validity",
  }
}
</i18n>
