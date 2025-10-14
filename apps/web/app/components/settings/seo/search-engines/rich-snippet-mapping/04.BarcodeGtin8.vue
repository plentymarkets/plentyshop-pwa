<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetBarcodeGtin8"
      data-testid="seo-barcode-gtin8"
      :options="seoRichSnippetBarcodeGtin8s"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin8-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin8-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="seoRichSnippetBarcodeGtin8 === '3'" class="mt-2">
      <UiFormLabel for="seoRichSnippetBarcodeGtin8Id">{{ getEditorTranslation('conditionalLabel') }}</UiFormLabel>
      <SfInput id="seoRichSnippetBarcodeGtin8Id" v-model="seoRichSnippetBarcodeGtin8Id" type="number" />
      <div v-if="seoRichSnippetBarcodeGtin8Id === ''" class="text-red-600">
        {{ getEditorTranslation('mustNotBeEmpty') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const seoRichSnippetBarcodeGtin8s = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin8');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeGtin8Id');

const seoRichSnippetBarcodeGtin8 = computed({
  get: () => String(getSetting()),
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
    "label": "Select source for GTIN-8 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for GTIN-8 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin8-1": "Do not display",
    "seoRichSnippetBarcodeGtin8-2": "Use first GTIN-8 barcode from variation",
    "seoRichSnippetBarcodeGtin8-3": "Use specific GTIN-8 barcode by ID",
    "mustNotBeEmpty": "GTIN-8 id must not be empty"
  },
  "de": {
    "label": "Select source for GTIN-8 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for GTIN-8 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin8-1": "Do not display",
    "seoRichSnippetBarcodeGtin8-2": "Use first GTIN8 barcode from variation",
    "seoRichSnippetBarcodeGtin8-3": "Use specific GTIN8 barcode by ID",
    "mustNotBeEmpty": "GTIN-8 id must not be empty"
  }
}
</i18n>
