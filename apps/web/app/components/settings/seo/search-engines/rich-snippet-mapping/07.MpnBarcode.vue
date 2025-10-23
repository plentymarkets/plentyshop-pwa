<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetMpnBarcode"
      data-testid="seo-mpn-barcode"
      :options="seoRichSnippetMpnBarcodes"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetMpnBarcode-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetMpnBarcode-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="seoRichSnippetMpnBarcode === '3'" class="mt-2">
      <UiFormLabel for="seoRichSnippetMpnBarcodeId">{{ getEditorTranslation('conditionalLabel') }}</UiFormLabel>
      <SfInput id="seoRichSnippetMpnBarcodeId" v-model="seoRichSnippetMpnBarcodeId" type="number" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
const seoRichSnippetMpnBarcodes = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetMpnBarcode');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } =
  useSiteSettings('seoRichSnippetMpnBarcodeId');

const seoRichSnippetMpnBarcode = computed({
  get: () => String(getSetting()),
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
