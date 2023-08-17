<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <CategoryPageContent
      v-if="productsCatalog"
      :title="$t('allProducts')"
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
import { Category } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { Breadcrumb } from '~/components/ui/Breadcrumbs/types';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { getFacetsFromURL } = useCategoryFilter();

const { fetchProducts, data: productsCatalog, productsPerPage } = useProducts();
const { t } = useI18n();

await fetchProducts(getFacetsFromURL());

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
    await fetchProducts(getFacetsFromURL());
  },
);
</script>
