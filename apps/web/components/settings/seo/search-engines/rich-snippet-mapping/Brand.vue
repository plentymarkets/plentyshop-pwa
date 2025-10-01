<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <SfSelect v-model="seoRichSnippetBrand" data-testid="seo-brand" class="w-full" :placeholder="getEditorTranslation('placeholder')">
      <option v-for="sortingOption in seoRichSnippetBrands" :key="sortingOption" :value="sortingOption"
        class="font-medium text-sm md:text-base">
        {{ getEditorTranslation('seoRichSnippetBrandOption-' + sortingOption) }}
      </option>
    </SfSelect>

    <div v-if="seoRichSnippetBrand === '3'" class="mt-2">
      <label for="seoRichSnippetBrandId">{{ getEditorTranslation('conditionalLabel') }}</label>
      <SfInput id="seoRichSnippetBrandId" v-model="seoRichSnippetBrandId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSelect } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBrand');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } = useSiteSettings('seoRichSnippetBrandId');

const seoRichSnippetBrand = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBrandId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
const seoRichSnippetBrands = ref(['1','2', '3']);
</script>

<i18n lang="json">{
  "en": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "Select source for the brand in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBrandOption-1": "Do not display",
    "seoRichSnippetBrandOption-2": "External name of the brand",
    "seoRichSnippetBrandOption-3": "Use brand name from variation property of the type text",
  },
  "de": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "Select source for the brand in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBrandOption-1": "De-Do not display",
    "seoRichSnippetBrandOption-2": "External name of the brand",
    "seoRichSnippetBrandOption-3": "Use brand name from variation property of the type text"
  }
}</i18n>
