<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetBarcodeIsbn"
      data-testid="seo-barcode-gtin-isbn"
      :options="seoRichSnippetBarcodeIsbns"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetBarcodeIsbn-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetBarcodeIsbn-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="seoRichSnippetBarcodeIsbn === '3'" class="mt-2">
      <UiFormLabel for="seoRichSnippetBarcodeIsbnId">{{ getEditorTranslation('conditionalLabel') }}</UiFormLabel>
      <SfInput id="seoRichSnippetBarcodeIsbnId" v-model="seoRichSnippetBarcodeIsbnId" type="number" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
const seoRichSnippetBarcodeIsbns = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeIsbn');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeIsbnId');

const seoRichSnippetBarcodeIsbn = computed({
  get: () => String(getSetting()),
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
