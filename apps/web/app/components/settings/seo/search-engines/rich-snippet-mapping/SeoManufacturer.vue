<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetManufacturer"
      data-testid="seo-manufacturer"
      :options="seoRichSnippetManufacturers"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetManufacturer-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetManufacturer-' + props.option) }}
      </template>
    </Multiselect>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
const seoRichSnippetManufacturers = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetManufacturer');

const seoRichSnippetManufacturer = computed({
  get: () => String(getSetting()),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for the manufacturer in Rich Snippets of the item page",
    "tooltip": "Select source for the manufacturer in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "seoRichSnippetManufacturer-1": "Do not display",
    "seoRichSnippetManufacturer-2": "External name of the manufacturer",
    "seoRichSnippetManufacturer-3": "Use brand name from variation property of the type text"
  },
  "de": {
    "label": "Select source for the manufacturer in Rich Snippets of the item page",
    "tooltip": "Select source for the manufacturer in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "seoRichSnippetManufacturer-1": "Do not display",
    "seoRichSnippetManufacturer-2": "External name of the manufacturer",
    "seoRichSnippetManufacturer-3": "Use brand name from variation property of the type text"
  }
}
</i18n>
