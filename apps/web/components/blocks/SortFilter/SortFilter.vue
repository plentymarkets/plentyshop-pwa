<template>
  <div v-if="content?.enableFilters" data-testid="category-sort-filter">
    <CategoryTree v-if="content?.fields.category && productsCatalog.category" :category="productsCatalog.category" />
    <CategorySorting v-if="content?.fields.sortBy" />
    <CategoryItemsPerPage
      v-if="content?.fields.perPage"
      class="mt-6"
      :total-products="productsCatalog.pagination?.totals ?? 0"
      :configuration="content"
    />
    <CategoryFilters
      v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
      :facets="productsCatalog.facets"
      :configuration="content"
    />
  </div>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';
import type { SortFilterProps } from './types';

const { data: productsCatalog } = useProducts();

const props = defineProps<SortFilterProps>();
</script>
