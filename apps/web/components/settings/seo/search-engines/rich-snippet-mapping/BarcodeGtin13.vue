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
        v-model="seoRichSnippetBarcodeGtin13"
        :options="Object.keys(seoRichSnippetBarcodeGtin13s)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-robots-item-page"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetBarcodeGtin13s[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetBarcodeGtin13s[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="seoRichSnippetBarcodeGtin13 === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeGtin13Id">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeGtin13Id" v-model="seoRichSnippetBarcodeGtin13Id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { seoRichSnippetBarcodeGtin13s } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBarcodeGtin13');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } = useSiteSettings(
  'seoRichSnippetBarcodeGtin13Id',
);

const seoRichSnippetBarcodeGtin13 = computed({
  get: () => getSetting(),
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
    "label": "Select source for Gtin13 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin13 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation"
  },
  "de": {
    "label": "Select source for Gtin13 barcode in Rich Snippets of the item page",
    "tooltip": "Select source for Gtin13 barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation"
  }
}
</i18n>
