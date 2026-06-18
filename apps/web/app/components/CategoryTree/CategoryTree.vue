<template>
  <div v-if="parentCategory || categoryItems?.length" class="category-tree">
    <div
      class="py-2 px-4 mb-4 bg-primary-50/50 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest rounded-none select-none"
      data-testid="category-tree"
    >
      {{ t('common.labels.category') }}
    </div>
    <template v-if="parentCategory">
      <CategoryTreeItem
        data-testid="category-parent-link"
        :name="breadcrumbGetters.getName(parentCategory)"
        :href="parentCategoryHref"
        :count="breadcrumbGetters.getItemCount(parentCategory)"
      >
        <SfIconArrowBack size="sm" class="text-neutral-500 mr-2" />
      </CategoryTreeItem>
    </template>
    <ul v-if="categoryItems?.length" class="mb-4 @md:mt-2" data-testid="categories">
      <CategoryTreeItem
        v-for="categoryItem in categoryItems"
        :key="categoryGetters.getSubCategoryId(categoryItem)"
        :name="categoryGetters.getSubCategoryName(categoryItem)"
        :href="buildSubcategoryHref(categoryItem)"
        :count="categoryGetters.getSubCategoryItemCount(categoryItem)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { SubCategory } from '@plentymarkets/shop-api';
import { categoryGetters, breadcrumbGetters } from '@plentymarkets/shop-api';
import type { CategoryTreeProps } from '~/components/CategoryTree/types';
import { SfIconArrowBack } from '@storefront-ui/vue';

const props = defineProps<CategoryTreeProps>();
const { t } = useI18n();
const { resolvePathTrailingSlash } = useUrlTrailingSlash();

const categoryItems = computed(() => categoryGetters.getSubCategories(props.category));

const currentCategoryPath = computed(() => {
  const current = breadcrumbGetters.getCurrent(props.breadcrumbs ?? []);
  return current ? breadcrumbGetters.getUrl(current) : '';
});

const parentCategory = computed(() => breadcrumbGetters.getParent(props.breadcrumbs ?? []));

const parentCategoryHref = computed(() => {
  const url = parentCategory.value ? breadcrumbGetters.getUrl(parentCategory.value) : '';
  return url ? resolvePathTrailingSlash(url) : '';
});

const buildSubcategoryHref = (subcategory: SubCategory): string => {
  const base = (currentCategoryPath.value ?? '').replace(/\/$/, '');
  const slug = categoryGetters.getSubCategoryNameUrl(subcategory);
  const path = `${base}/${slug}`;
  return resolvePathTrailingSlash(path);
};
</script>
