<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <SfSelect v-model="seoRichSnippetBarcodeGtin13" data-testid="seo-barcode-gtin13" class="w-full" :placeholder="getEditorTranslation('placeholder')">
      <option v-for="sortingOption in seoRichSnippetBarcodeGtin13s" :key="sortingOption" :value="sortingOption"
        class="font-medium text-sm md:text-base">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin13-' + sortingOption) }}
      </option>
    </SfSelect>
    <div v-if="seoRichSnippetBarcodeGtin13 === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeGtin13Id">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeGtin13Id" v-model="seoRichSnippetBarcodeGtin13Id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetBarcodeGtin13s = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin13');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeGtin13Id');

const seoRichSnippetBarcodeGtin13 = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBarcodeGtin13Id = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for Gtin8 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin8 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin13-1": "Do not display",
    "seoRichSnippetBarcodeGtin13-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin13-3": "Use specific GTIN barcode by ID"
  },
  "de": {
    "label": "Select source for Gtin8 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin8 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin13-1": "Do not display",
    "seoRichSnippetBarcodeGtin13-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin13-3": "Use specific GTIN barcode by ID"
  }
}
</i18n>
  