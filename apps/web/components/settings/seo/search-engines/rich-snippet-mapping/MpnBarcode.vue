<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <Multiselect
        v-model="seoRichSnippetMpnBarcode"
        :options="Object.keys(seoRichSnippetMpnBarcodes)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-mpn-barcode"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetMpnBarcodes[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetMpnBarcodes[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="seoRichSnippetMpnBarcode === '3'" class="mt-2">
      <label for="seoRichSnippetMpnBarcodeId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetMpnBarcodeId" v-model="seoRichSnippetMpnBarcodeId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { seoRichSnippetMpnBarcodes } from '~/utils/editorSettings';

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
    "conditionalLabel": "Enter the ID of the variation property"
  },
  "de": {
    "label": "Select source for the MPN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for the MPN barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "ID aus Varianteneigenschaft vom Typ Text"
  }
}
</i18n>
