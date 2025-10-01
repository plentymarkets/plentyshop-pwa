<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <SfSelect
      v-model="seoRichSnippetBarcodeGtin8"
      data-testid="seo-barcode-gtin8"
      class="w-full"
      :placeholder="getEditorTranslation('placeholder')"
    >
      <option
        v-for="sortingOption in seoRichSnippetBarcodeGtin8s"
        :key="sortingOption"
        :value="sortingOption"
        class="font-medium text-sm md:text-base"
      >
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin8-' + sortingOption) }}
      </option>
    </SfSelect>
    <div v-if="seoRichSnippetBarcodeGtin8 === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeGtin8Id">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeGtin8Id" v-model="seoRichSnippetBarcodeGtin8Id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetBarcodeGtin8s = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin8');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeGtin8Id');

const seoRichSnippetBarcodeGtin8 = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBarcodeGtin8Id = computed({
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
    "seoRichSnippetBarcodeGtin8-1": "Do not display",
    "seoRichSnippetBarcodeGtin8-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin8-3": "Use specific GTIN barcode by ID"
  },
  "de": {
    "label": "Select source for Gtin8 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin8 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin8-1": "Do not display",
    "seoRichSnippetBarcodeGtin8-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin8-3": "Use specific GTIN barcode by ID"
  }
}
</i18n>
