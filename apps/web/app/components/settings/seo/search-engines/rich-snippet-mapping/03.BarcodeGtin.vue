<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetBarcodeGtin"
      data-testid="seo-barcode-gtin"
      :options="seoRichSnippetBarcodeGtins"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetBarcodeGtin-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="seoRichSnippetBarcodeGtin === '3'" class="mt-2">
      <UiFormLabel for="seoRichSnippetBarcodeGtinId">{{ getEditorTranslation('conditionalLabel') }}</UiFormLabel>
      <SfInput id="seoRichSnippetBarcodeGtinId" v-model="seoRichSnippetBarcodeGtinId" type="number" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const seoRichSnippetBarcodeGtins = ref(['1', '2', '3']);
const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetBarcodeGtinId');

const seoRichSnippetBarcodeGtin = computed({
  get: () => String(getSetting()),
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
    "label": "Select source for GTIN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for GTIN barcode in Rich Snippets of the item page",
    "placeholder": "Select barcode",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBarcodeGtin-1": "Do not display",
    "seoRichSnippetBarcodeGtin-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin-3": "Use specific GTIN barcode by ID",
  },
  "de": {
    "label": "Select source for GTIN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for GTIN barcode in Rich Snippets of the item page",
    "placeholder": "Select barcode",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBarcodeGtin-1": "Do not display",
    "seoRichSnippetBarcodeGtin-2": "Use first GTIN barcode from variation",
    "seoRichSnippetBarcodeGtin-3": "Use specific GTIN barcode by ID",
  }
}
</i18n>
