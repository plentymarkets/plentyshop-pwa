<template>
  <div class="p-2 sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto">
    <div class="p-2">
      <UiFormLabel>{{ getEditorTranslation('category-id-label') }}</UiFormLabel>
      <SfInput
        :model-value="recommendedBlock.categoryId"
        data-testid="recommended-form-categoryid"
        name="category Id"
        type="text"
        :placeholder="getEditorTranslation('category-id-placeholder')"
        @input="debouncedFn($event)"
      />
    </div>
    <EditorBlocksTextFieldsGroup
      v-if="recommendedBlock.text"
      :model="recommendedBlock.text"
      :pretitle-label="getEditorTranslation('pretitle-label')"
      :pretitle-placeholder="getEditorTranslation('pretitle-placeholder')"
      pretitle-testid="recommended-form-pretitle"
      :title-label="getEditorTranslation('main-title-label')"
      :title-placeholder="getEditorTranslation('main-title-placeholder')"
      title-testid="recommended-form-title"
      :subtitle-label="getEditorTranslation('subtitle-label')"
      :subtitle-placeholder="getEditorTranslation('subtitle-placeholder')"
      subtitle-testid="recommended-form-subtitle"
      :description-label="getEditorTranslation('description-label')"
      :description-placeholder="getEditorTranslation('description-placeholder')"
      description-testid="recommended-form-html"
      :color-label="getEditorTranslation('text-color-label')"
      color-testid="color-input"
      :text-align-label="getEditorTranslation('text-align-label')"
      :text-align-left-label="getEditorTranslation('text-align-option-left-label')"
      :text-align-center-label="getEditorTranslation('text-align-option-center-label')"
      :text-align-right-label="getEditorTranslation('text-align-option-right-label')"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsContent } from '../ProductRecommendedProducts/types';
import { SfInput } from '@storefront-ui/vue';
import { useDebounceFn } from '@vueuse/core';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const recommendedBlock = computed<ProductRecommendedProductsContent>(() => {
  const rawContent = (findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content ??
    {}) as ProductRecommendedProductsContent;
  if (!rawContent.text) rawContent.text = {};
  if (!rawContent.text.color) rawContent.text.color = '#000000';
  return rawContent;
});

const debouncedFn = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement;
  recommendedBlock.value.categoryId = target.value.toString();
}, 1000);
</script>

<i18n lang="json">
{
  "en": {
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",

    "main-title-label": "Main Title",
    "main-title-placeholder": "Title",

    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Subtitle",

    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "category-id-label": "Category ID",
    "category-id-placeholder": "Enter Category Id",

    "text-color-label": "Text Colour",

    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right"
  },
  "de": {
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",

    "main-title-label": "Main Title",
    "main-title-placeholder": "Title",

    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Subtitle",

    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "category-id-label": "Category ID",
    "category-id-placeholder": "Enter Category Id",

    "text-color-label": "Text Colour",

    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right"
  }
}
</i18n>
