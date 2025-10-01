<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <SfSelect
      v-model="seoRichSnippetBarcodeGtin"
      data-testid="seo-barcode-gtin"
      class="w-full"
      :placeholder="getEditorTranslation('placeholder')"
    >
      <option
        v-for="sortingOption in seoRichSnippetBarcodeGtins"
        :key="sortingOption"
        :value="sortingOption"
        class="font-medium text-sm md:text-base"
      >
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin-' + sortingOption) }}
      </option>
    </SfSelect>

    <div v-if="seoRichSnippetBarcodeGtin === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeGtinId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeGtinId" v-model="seoRichSnippetBarcodeGtinId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetBarcodeGtins = ref(['1', '2', '3']);
const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeGtinId');

const seoRichSnippetBarcodeGtin = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBarcodeGtinId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for Gtin barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin barcode in Rich Snippets of the item page",
    "placeholder": "Select barcode",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBarcodeGtin-1": "Do not display",
    "seoRichSnippetBarcodeGtin-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin-3": "Use specific GTIN barcode by ID"
  },
  "de": {
    "label": "Select source for Gtin barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin barcode in Rich Snippets of the item page",
    "placeholder": "Select barcode",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBarcodeGtin-1": "Do not display",
    "seoRichSnippetBarcodeGtin-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin-3": "Use specific GTIN barcode by ID"
  }
}
</i18n>
