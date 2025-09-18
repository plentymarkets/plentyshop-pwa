<template>
  <div data-testid="category-sort-filter">
    <CategoryTree v-if="productsCatalog.category" :category="productsCatalog.category" />
    <CategorySorting />
    <CategoryItemsPerPage class="mt-6" :total-products="productsCatalog.pagination?.totals ?? 0" />
    <CategoryFilters
        v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
        :facets="productsCatalog.facets"
    />
  </div>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';

const { data: productsCatalog } = useProducts();
</script>
