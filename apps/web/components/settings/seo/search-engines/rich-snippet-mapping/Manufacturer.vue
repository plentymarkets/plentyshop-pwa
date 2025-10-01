<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <SfSelect
      v-model="seoRichSnippetManufacturer"
      data-testid="seo-manufacturer"
      class="w-full"
      :placeholder="getEditorTranslation('placeholder')"
    >
      <option
        v-for="sortingOption in seoRichSnippetManufacturers"
        :key="sortingOption"
        :value="sortingOption"
        class="font-medium text-sm md:text-base"
      >
        {{ getEditorTranslation('seoRichSnippetManufacturer-' + sortingOption) }}
      </option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';
const seoRichSnippetManufacturers = ref(['1', '2', '3']);

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetManufacturer');

const seoRichSnippetManufacturer = computed({
  get: () => getSetting(),
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
