<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <CategoryPageContent
      v-if="productsCatalog"
      :title="$t('allProducts')"
      :total-products="productsCatalog.pagination.totals"
      :products="productsCatalog.products"
    >
      <template #sidebar>
        <CategoryTree :categories="categories" :parent="{ name: $t('allProducts'), href: paths.category }" />
        <CategorySorting />
        <!-- <CategoryFilters :facets="productsCatalog.facets" /> -->
      </template>
    </CategoryPageContent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Breadcrumb } from '~/components/ui/Breadcrumbs/types';
import { Category } from '../../../../plentymarkets-sdk/packages/api-client';

definePageMeta({
  layout: false,
});

const { fetchProducts, data: productsCatalog } = useProducts();
const { t } = useI18n();

await fetchProducts({});

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
</script>
