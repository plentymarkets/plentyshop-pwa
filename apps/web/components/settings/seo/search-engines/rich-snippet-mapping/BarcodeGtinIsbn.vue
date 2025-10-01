<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <SfSelect
      v-model="seoRichSnippetBarcodeIsbn"
      data-testid="seo-barcode-gtin-isbn"
      class="w-full"
      :placeholder="getEditorTranslation('placeholder')"
    >
      <option
        v-for="sortingOption in seoRichSnippetBarcodeIsbns"
        :key="sortingOption"
        :value="sortingOption"
        class="font-medium text-sm md:text-base"
      >
        {{ getEditorTranslation('seoRichSnippetBarcodeIsbn-' + sortingOption) }}
      </option>
    </SfSelect>

    <div v-if="seoRichSnippetBarcodeIsbn === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeIsbnId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeIsbnId" v-model="seoRichSnippetBarcodeIsbnId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetBarcodeIsbns = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeIsbn');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeIsbnId');

const seoRichSnippetBarcodeIsbn = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBarcodeIsbnId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for ISBN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for ISBN barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeIsbn-1": "Do not display",
    "seoRichSnippetBarcodeIsbn-2": "Use first ISBN barcode from variation",
    "seoRichSnippetBarcodeIsbn-3": "Use specific ISBN barcode by ID"
  },
  "de": {
    "label": "Select source for ISBN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for ISBN barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeIsbn-1": "Do not display",
    "seoRichSnippetBarcodeIsbn-2": "Use first ISBN barcode from variation",
    "seoRichSnippetBarcodeIsbn-3": "Use specific ISBN barcode by ID"
  }
}
</i18n>
