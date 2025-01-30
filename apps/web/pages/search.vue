<template>
  <NuxtLayout name="default">
    <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
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
          <CategoryFilters v-if="facetGetters.hasFilters(productsCatalog.facets)" :facets="productsCatalog.facets" />
        </template>
      </CategoryPageContent>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
const { getRobots, setRobotForStaticPage } = useRobots();

definePageMeta({
  layout: false,
});

const route = useRoute();
const { getSearch, data: productsCatalog, productsPerPage, loading } = useSearch();
const { getFacetsFromURL } = useCategoryFilter();

const handleQueryUpdate = async () => {
  await getSearch(getFacetsFromURL());
};

await handleQueryUpdate();

watch(
  () => route.query,
  async () => {
    handleQueryUpdate();
  },
);

await getRobots();
setRobotForStaticPage('SearchResult');
</script>
