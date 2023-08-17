<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <CategoryPageContent
      v-if="productsCatalog"
      :title="categoryTreeGetters.getName(productsCatalog.category)"
      :total-products="productsCatalog.pagination.totals"
      :products="productsCatalog.products"
      :items-per-page="Number(productsPerPage)"
    >
      <template #sidebar>
        <CategoryTree :categories="categories" :parent="{ name: $t('allProducts'), href: paths.category }" />
        <CategorySorting />
        <CategoryItemsPerPage class="mt-6" :total-products="productsCatalog.pagination.totals" />
        <CategoryFilters :facets="productsCatalog.facets" />
      </template>
    </CategoryPageContent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { Category, CategoryTreeItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { categoryTreeGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import type { Breadcrumb } from '~/components/ui/Breadcrumbs/types';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { getFacetsFromURL } = useCategoryFilter();

const { fetchProducts, data: productsCatalog, productsPerPage } = useProducts();
const { data: categoryTree } = useCategoryTree();
const { t } = useI18n();
const category = ref(undefined as CategoryTreeItem | undefined);

const findCategoryBySlugs = (categories: CategoryTreeItem[], slugs: string[]): CategoryTreeItem | undefined => {
  const category = categories.find((item) => categoryTreeGetters.getSlug(item) === slugs[0]);
  if (category && slugs.length > 1 && category.children) {
    return findCategoryBySlugs(category.children, slugs.slice(1));
  }
  return category;
};

const generateSearchParams = () => {
  const urlParams = getFacetsFromURL();
  category.value = findCategoryBySlugs(categoryTree.value, urlParams.categorySlugs || ['']);
  urlParams.categoryId = category.value?.id.toString();
  return urlParams;
};

await fetchProducts(generateSearchParams());

const breadcrumbs: Breadcrumb[] = [
  { name: t('home'), link: '/' },
  { name: t('allProducts'), link: '/category' },
];
const subCategories = productsCatalog.value?.category.children ?? [];

const categories = computed(
  () =>
    subCategories?.map((item: Category) => ({
      name: item?.details[0].name,
      count: undefined,
      href: paths.category,
    })) || [],
);

watch(
  () => route.query,
  async () => {
    await fetchProducts(generateSearchParams());
  },
);
</script>
