<template>
  <div v-if="categoryItems?.length" class="category-tree">
    <div
      class="py-2 px-4 mb-4 bg-primary-50/50 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest rounded-none select-none"
      data-testid="category-tree"
    >
      {{ t('common.labels.category') }}
    </div>
    <ul class="mb-4 md:mt-2" data-testid="categories">
      <CategoryTreeItem
        v-for="(categoryItem, index) in categoryItems"
        :key="index"
        :name="categoryGetters.getSubcategoryName(categoryItem)"
        :href="buildSubcategoryHref(categoryItem)"
        :count="categoryGetters.getSubcategoryItemCount(categoryItem)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { categoryGetters, Subcategory } from '@plentymarkets/shop-api';
import type { CategoryTreeProps } from '~/components/CategoryTree/types';

const props = defineProps<CategoryTreeProps>();
const localePath = useLocalePath();
const { t } = useI18n();

const categoryItems = computed(() =>
  categoryGetters.getSubcategories(props.category),
);

const buildSubcategoryHref = (subcategory: Subcategory): string => {
  const base = (props.basePath ?? '').replace(/\/$/, '');
  const slug = categoryGetters.getSubcategoryNameUrl(subcategory);
  return localePath(`${base}/${slug}`);
};
</script>