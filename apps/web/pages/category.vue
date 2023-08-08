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
        <CategoryItemsPerPage
          class="mt-6"
          @selected="selected($event)"
          :total-products="productsCatalog.products.length"
        />
        <CategoryFilters :facets="productsCatalog.facets" />
      </template>
    </CategoryPageContent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Category } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { Breadcrumb } from '~/components/ui/Breadcrumbs/types';

definePageMeta({
  layout: false,
});

const { fetchProducts, data: productsCatalog, DEFAULT_ITEMS_PER_PAGE } = useProducts();
const { t } = useI18n();

await fetchProducts({
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
});

const selected = async (event) => {
  await fetchProducts({ itemsPerPage: event });
};

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
