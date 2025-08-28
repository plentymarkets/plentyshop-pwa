<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="barCode"
        :options="barCodes"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-source-brand"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin13');

const barCode = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const barCodes = ['Do not display', 'External name of the manufacturer', 'Name of the manufacturer'];
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
