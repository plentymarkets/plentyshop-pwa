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
    "label": "Price Validity ID",
    "tooltip": "Enter the ID of the Price Validity variation property in your system.",
    "placeholder": "Enter Price Validity ID"
  },
  "de": {
    "label": "Price Validity ID",
    "tooltip": "Enter the ID of the Price Validity variation property in your system.",
    "placeholder": "Enter Price Validity ID"
  }
}
</i18n>
