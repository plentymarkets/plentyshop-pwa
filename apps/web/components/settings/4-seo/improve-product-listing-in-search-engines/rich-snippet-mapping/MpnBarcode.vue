<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="mpnBarCode"
        :options="mpnBarCodes"
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


const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetMpnBarcode');

const mpnBarCode = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
const mpnBarCodes = ['Do not display', 'Show external variation ID', 'Use MPN from variation property of the type text'];
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
