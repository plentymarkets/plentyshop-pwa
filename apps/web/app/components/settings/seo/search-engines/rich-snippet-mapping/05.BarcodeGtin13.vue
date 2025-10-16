<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetBarcodeGtin13"
      data-testid="seo-barcode-gtin13"
      :options="seoRichSnippetBarcodeGtin13s"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin13-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin13-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="seoRichSnippetBarcodeGtin13 === '3'" class="mt-2">
      <UiFormLabel for="seoRichSnippetBarcodeGtin13Id">{{ getEditorTranslation('conditionalLabel') }}</UiFormLabel>
      <SfInput id="seoRichSnippetBarcodeGtin13Id" v-model="seoRichSnippetBarcodeGtin13Id" type="number" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const seoRichSnippetBarcodeGtin13s = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin13');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } = useSiteSettings(
  'seoRichSnippetBarcodeGtin13Id',
);

const seoRichSnippetBarcodeGtin13 = computed({
  get: () => String(getSetting()),
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
    "label": "Select source for GTIN-13 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for GTIN-13 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin13-1": "Do not display",
    "seoRichSnippetBarcodeGtin13-2": "Use first GTIN-13 barcode from variation",
    "seoRichSnippetBarcodeGtin13-3": "Use specific GTIN-13 barcode by ID"
  },
  "de": {
    "label": "Select source for GTIN-13 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for GTIN-13 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation",
    "seoRichSnippetBarcodeGtin13-1": "Do not display",
    "seoRichSnippetBarcodeGtin13-2": "Use first GTIN-13 barcode from variation",
    "seoRichSnippetBarcodeGtin13-3": "Use specific GTIN-13 barcode by ID"
  }
}
</i18n>
