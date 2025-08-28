<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="skuCode"
        :options="skuCodes"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-mpn-barcode"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';


const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetSkuBarcode');

const skuCode = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
const skuCodes = ['Use variation ID', 'Use variation ID', 'Use SKU from variation property'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source Barcode Mpn",
    "description": "",
    "placeholder": ""
  },
  "de": {
    "label": "Select source Barcode Mpn",
    "description": "",
    "placeholder": ""
  }
}
</i18n>
