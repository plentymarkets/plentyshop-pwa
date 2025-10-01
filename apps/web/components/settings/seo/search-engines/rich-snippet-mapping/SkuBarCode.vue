<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <Multiselect
        v-model="seoRichSnippetSkuBarcode"
        :options="Object.keys(seoRichSnippetSkuBarcodes)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-sku-barcode"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetSkuBarcodes[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetSkuBarcodes[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="seoRichSnippetSkuBarcode === '3'" class="mt-2">
      <label for="seoRichSnippetSkuBarcodeId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetSkuBarcodeId" v-model="seoRichSnippetSkuBarcodeId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { seoRichSnippetSkuBarcodes } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetSkuBarcode');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetSkuBarcodeId');

const seoRichSnippetSkuBarcode = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetSkuBarcodeId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for SKU barcode in Rich Snippets of the item page",
    "tooltip": "Select source for SKU barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property"
  },
  "de": {
    "label": "Select source for SKU barcode in Rich Snippets of the item page",
    "tooltip": "Select source for SKU barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property"
  }
}
</i18n>
