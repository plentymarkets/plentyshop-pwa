<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <CategoryPageContent
      v-if="productsCatalog"
      :title="categoryGetters.getCategoryName(productsCatalog.category)"
      :total-products="productsCatalog.pagination.totals"
      :products="productsCatalog.products"
      :items-per-page="Number(productsPerPage)"
    >
      <template #sidebar>
        <CategoryTree
          v-if="category.children?.length || parentCategory.length > 1"
          :categories="category.children ?? []"
          :parent="
            parentCategory.length > 1
              ? {
                  name: categoryGetters.getCategoryName(parentCategory[parentCategory.length - 2]),
                  href: categoryTreeGetters.generateCategoryLink(
                    categoryTree,
                    parentCategory[parentCategory.length - 2],
                  ),
                }
              : null
          "
        />
        <CategorySorting />
        <CategoryItemsPerPage class="mt-6" :total-products="productsCatalog.pagination.totals" />
        <CategoryFilters :facets="productsCatalog.facets" />
      </template>
    </CategoryPageContent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { categoryGetters, categoryTreeGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import type { Breadcrumb } from '~/components/ui/Breadcrumbs/types';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { getFacetsFromURL } = useCategoryFilter();
const { fetchProducts, data: productsCatalog, productsPerPage } = useProducts();
const { getCategoryTree, data: categoryTree } = useCategoryTree();
const { t } = useI18n();
const breadcrumbs = ref([] as Breadcrumb[]);
const urlParams = ref(getFacetsFromURL());
const category = ref(
  categoryTreeGetters.findCategoryBySlugs(categoryTree.value, urlParams.value.categorySlugs || ['']),
);
const parentCategory = ref(
  categoryTreeGetters.findCategoriesPathByCategoryId(categoryTree.value, category.value?.id ?? 0),
);

const generateSearchParams = () => {
  urlParams.value = getFacetsFromURL();
  category.value = categoryTreeGetters.findCategoryBySlugs(categoryTree.value, urlParams.value.categorySlugs || ['']);
  urlParams.value.categoryId = category.value?.id?.toString();
  parentCategory.value = categoryTreeGetters.findCategoriesPathByCategoryId(
    categoryTree.value,
    category.value?.id ?? 0,
  );

  breadcrumbs.value = category.value
    ? categoryTreeGetters.generateBreadcrumbFromCategory(categoryTree.value, category.value)
    : [{ name: t('allProducts'), link: '#' }];

  breadcrumbs.value.unshift({ name: t('home'), link: '/' });

  return urlParams.value;
};

await getCategoryTree();
await fetchProducts(generateSearchParams());

watch(
  () => route.query,
  async () => {
    await fetchProducts(generateSearchParams());
  },
);
</script>
