<template>
  <NuxtLayout name="default">
    <CategoryPageContent
      v-if="productsCatalog"
      :title="$t('resultsFor', { phrase: route.query.term })"
      :total-products="productsCatalog.pagination.totals"
      :products="productsCatalog.products"
      :items-per-page="Number(productsPerPage)"
    >
      <template #sidebar>
        <CategorySorting />
        <CategoryItemsPerPage class="mt-6" :total-products="productsCatalog.pagination.totals" />
        <CategoryFilters :facets="productsCatalog.facets" />
      </template>
    </CategoryPageContent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { getSearch, data: productsCatalog, productsPerPage } = useSearch();
const { getFacetsFromURL } = useCategoryFilter();

await getSearch(getFacetsFromURL());
const handleQueryUpdate = async () => {
  await getSearch(getFacetsFromURL());
};

watch(
  () => route.query,
  async () => {
    handleQueryUpdate();
  },
);
</script>
