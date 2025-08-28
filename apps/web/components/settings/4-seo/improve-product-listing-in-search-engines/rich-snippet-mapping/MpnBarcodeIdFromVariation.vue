<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput v-model="seoRichSnippetBarcodeIdFromVariation" :placeholder="getEditorTranslation('placeholder')" type="text" />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeIdFromVariation');

const seoRichSnippetBarcodeIdFromVariation = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for GTIN-8 barcode in Rich Snippets of the item page",
    "description": "",
    "placeholder": ""
  },
  "de": {
    "label": "Select source for GTIN-8 barcode in Rich Snippets of the item page",
    "description": "",
    "placeholder": ""
  }
}
</i18n>
