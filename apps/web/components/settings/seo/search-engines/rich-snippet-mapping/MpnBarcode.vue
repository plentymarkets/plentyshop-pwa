<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <SfSelect v-model="seoRichSnippetMpnBarcode" data-testid="seo-mpn-barcode" class="w-full" :placeholder="getEditorTranslation('placeholder')">
      <option v-for="sortingOption in seoRichSnippetMpnBarcodes" :key="sortingOption" :value="sortingOption"
        class="font-medium text-sm md:text-base">
        {{ getEditorTranslation('seoRichSnippetMpnBarcode-' + sortingOption) }}
      </option>
    </SfSelect>

    <div v-if="seoRichSnippetMpnBarcode === '3'" class="mt-2">
      <label for="seoRichSnippetMpnBarcodeId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetMpnBarcodeId" v-model="seoRichSnippetMpnBarcodeId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetMpnBarcodes = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetMpnBarcode');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetMpnBarcodeId');

const seoRichSnippetMpnBarcode = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetMpnBarcodeId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for the MPN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for the MPN barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetMpnBarcode-1": "Do not display",
    "seoRichSnippetMpnBarcode-2": "Show external variation ID",
    "seoRichSnippetMpnBarcode-3": "Use MPN from variation property of the type text"
  },
  "de": {
    "label": "Select source for the MPN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for the MPN barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "ID aus Varianteneigenschaft vom Typ Text",
    "seoRichSnippetMpnBarcode-1": "Do not display",
    "seoRichSnippetMpnBarcode-2": "Show external variation ID",
    "seoRichSnippetMpnBarcode-3": "Use MPN from variation property of the type text"
  }
}
</i18n>
