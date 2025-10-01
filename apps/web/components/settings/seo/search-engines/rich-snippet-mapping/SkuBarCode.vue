<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <SfSelect v-model="seoRichSnippetSkuBarcode" data-testid="seo-sku-barcode" class="w-full" :placeholder="getEditorTranslation('placeholder')">
      <option v-for="sortingOption in seoRichSnippetSkuBarcodes" :key="sortingOption" :value="sortingOption"
        class="font-medium text-sm md:text-base">
        {{ getEditorTranslation('seoRichSnippetSkuBarcode-' + sortingOption) }}
      </option>
    </SfSelect>

    <div v-if="seoRichSnippetSkuBarcode === '3'" class="mt-2">
      <label for="seoRichSnippetSkuBarcodeId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetSkuBarcodeId" v-model="seoRichSnippetSkuBarcodeId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetSkuBarcodes = ref(['1', '2', '3']);

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
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetSkuBarcode-1": "Use variation ID",
    "seoRichSnippetSkuBarcode-2": "Use variation number",
    "seoRichSnippetSkuBarcode-3": "Use SKU from variation property",
    "seoRichSnippetSkuBarcode-4": "Item ID"
  },
  "de": {
    "label": "Select source for SKU barcode in Rich Snippets of the item page",
    "tooltip": "Select source for SKU barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetSkuBarcode-1": "Use variation ID",
    "seoRichSnippetSkuBarcode-2": "Use variation number",
    "seoRichSnippetSkuBarcode-3": "Use SKU from variation property",
    "seoRichSnippetSkuBarcode-4": "Item ID"
  }
}
</i18n>
