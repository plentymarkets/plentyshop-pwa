<template>
  <NuxtLayout name="default">
    <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
      <CategoryPageContent
        v-if="productsCatalog"
        :title="$t('resultsFor', { phrase: tagName })"
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

definePageMeta({
  layout: false,
});

const route = useRoute();
const { data: productsCatalog, productsPerPage, loading, searchByTag } = useSearch();
const { getFacetsFromURL } = useCategoryFilter();

const [tagName, tagId] = route.params.slug.toString().split('_');

const handleQueryUpdate = async () => {
  await searchByTag(tagId, getFacetsFromURL());
};

handleQueryUpdate();

watch(
  () => route.query,
  async () => {
    handleQueryUpdate();
  },
);
</script>
