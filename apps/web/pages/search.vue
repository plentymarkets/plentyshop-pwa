<template>
  <NuxtLayout name="default">
    <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="lg" />
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
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { getSearch, data: productsCatalog, productsPerPage, loading } = useSearch();
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
