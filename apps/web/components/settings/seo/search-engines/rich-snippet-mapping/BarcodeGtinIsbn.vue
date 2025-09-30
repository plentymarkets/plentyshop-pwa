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
        v-model="seoRichSnippetBarcodeIsbn"
        :options="Object.keys(seoRichSnippetBarcodeIsbns)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-robots-item-page"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetBarcodeIsbns[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetBarcodeIsbns[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="seoRichSnippetBarcodeIsbn === '3'" class="mt-2">
      <label for="seoRichSnippetBarcodeIsbnId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBarcodeIsbnId" v-model="seoRichSnippetBarcodeIsbnId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { seoRichSnippetBarcodeIsbns } from '~/utils/editorSettings';

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
    "conditionalLabel": "Enter the barcode ID variation"
  },
  "de": {
    "label": "Select source for ISBN barcode in Rich Snippets of the item page",
    "tooltip": "Select source for ISBN barcode in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the barcode ID variation"
  }
}
</i18n>
