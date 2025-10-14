<template>
  <div class="py-2 mb-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="seoRichSnippetBrand"
      data-testid="seo-brand"
      :options="seoRichSnippetBrands"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('seoRichSnippetBrandOption-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('seoRichSnippetBrandOption-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="seoRichSnippetBrand === '3'" class="mt-2">
      <UiFormLabel for="seoRichSnippetBrandId">{{ getEditorTranslation('conditionalLabel') }}</UiFormLabel>
      <SfInput id="seoRichSnippetBrandId" v-model="seoRichSnippetBrandId" type="number" />
      <div v-if="seoRichSnippetBrandId === ''" class="text-red-600">{{ getEditorTranslation('mustNotBeEmpty') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBrand');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } = useSiteSettings('seoRichSnippetBrandId');

const seoRichSnippetBrand = computed({
  get: () => String(getSetting()),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBrandId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
const seoRichSnippetBrands = ref(['1', '2', '3']);
</script>

<i18n lang="json">
{
  "en": {
    "description": "Map item data fields from your backend to Schema.org fields for Rich Snippets. This improves how search engines interpret your products and can enhance their presentation in search results.",
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "Select source for the brand in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBrandOption-1": "Do not display",
    "seoRichSnippetBrandOption-2": "External name of the manufacturer",
    "seoRichSnippetBrandOption-3": "Use brand name from variation property of the type text",
    "mustNotBeEmpty": "seoRichSnippetBrandId id must not be empty"
  },
  "de": {
    "description": "Map item data fields from your backend to Schema.org fields for Rich Snippets. This improves how search engines interpret your products and can enhance their presentation in search results.",
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "Select source for the brand in Rich Snippets of the item page",
    "placeholder": "Select robots",
    "conditionalLabel": "Enter the ID of the variation property",
    "seoRichSnippetBrandOption-1": "De-Do not display",
    "seoRichSnippetBrandOption-2": "External name of the brand",
    "seoRichSnippetBrandOption-3": "Use brand name from variation property of the type text",
    "mustNotBeEmpty": "seoRichSnippetBrandId id must not be empty"
  }
}
</i18n>
