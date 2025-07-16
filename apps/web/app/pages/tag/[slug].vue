<template>
  <NuxtLayout name="default">
    <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
      <CategoryPageContent
        v-if="productsCatalog"
        :title="t('resultsFor', { phrase: tagName })"
        :total-products="searchPaginationTotals"
        :products="productsCatalog.products"
        :items-per-page="Number(productsPerPage)"
      >
        <template #sidebar>
          <CategorySorting />
          <CategoryItemsPerPage class="mt-6" :total-products="searchPaginationTotals" />
          <CategoryFilters
            v-if="productsCatalog?.facets?.length && facetGetters.hasFilters(productsCatalog?.facets)"
            :facets="productsCatalog.facets"
          />
        </template>
      </CategoryPageContent>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({ layout: false });

const route = useRoute();
const { t } = useI18n();
const { data: productsCatalog, productsPerPage, loading, searchByTag } = useSearch();
const { getFacetsFromURL } = useCategoryFilter();
const [tagName, tagId] = (route.params.slug?.toString() ?? '').split('_');

onNuxtReady(async () => {
  if (tagId) {
    await searchByTag(tagId, getFacetsFromURL());
  }
});

const searchPaginationTotals = computed(() => productsCatalog.value?.pagination?.totals || 0);

watch(
  () => route.query,
  async () => {
    if (tagId) {
      await searchByTag(tagId, getFacetsFromURL());
    }
  },
);
</script>
