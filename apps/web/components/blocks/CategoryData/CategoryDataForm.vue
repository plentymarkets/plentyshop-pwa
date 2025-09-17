<template>
  <div class="p-2 sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto">
    <div v-if="categoryBlock.name" class="p-2">
      <UiFormLabel>{{ getEditorTranslation('category-label') }}</UiFormLabel>
      <SfInput
        v-model="categoryBlock.name"
        data-testid="category-form-name"
        name="categoryName"
        type="text"
        :placeholder="getEditorTranslation('category-placeholder')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryDataContent } from './types';
import { SfInput } from '@storefront-ui/vue';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const categoryBlock = computed(
  () =>
    (findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content || {
      categoryId: '16',
      name: 'Category name',
    }) as CategoryDataContent,
);
</script>

<i18n lang="json">
{
  "en": {
    "category-label": "Category name",
    "category-placeholder": "Category name"
  },
  "de": {
    "category-label": "Category name",
    "category-placeholder": "Category name"
  }
}
</i18n>
