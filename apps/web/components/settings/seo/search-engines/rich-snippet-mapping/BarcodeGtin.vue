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
        v-model="seoRichSnippetBarcodeGtin"
        :options="Object.keys(seoRichSnippetBarcodeGtins)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-robots-item-page"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetBarcodeGtins[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetBarcodeGtins[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="seoRichSnippetBarcodeGtin === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeGtinId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeGtinId" v-model="seoRichSnippetBarcodeGtinId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { seoRichSnippetBarcodeGtins } from '~/utils/editorSettings';

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
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property"
  },
  "de": {
    "label": "Select source for Gtin barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property"
  }
}
</i18n>
