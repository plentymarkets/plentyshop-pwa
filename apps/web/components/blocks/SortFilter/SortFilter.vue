<template>
  <div v-if="content?.enableFilters" data-testid="category-sort-filter">
    <template v-for="key in content?.filtersOrder" :key="key">
      <template v-if="key === 'category' && content?.fields.category">
        <CategoryTree v-if="productsCatalog.category" :category="productsCatalog.category" />
      </template>

      <template v-if="key === 'sortBy' && content?.fields.sortBy">
        <CategorySorting />
      </template>

      <template v-if="key === 'perPage' && content?.fields.perPage">
        <CategoryItemsPerPage
          class="mt-6"
          :total-products="productsCatalog.pagination?.totals ?? 0"
          :configuration="content"
        />
      </template>

      <template v-if="key === 'itemRating' && content?.fields.itemRating">
        <CategoryFilters
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :renderKey="key"
        />
      </template>

      <template v-if="key === 'manufacturer' && content?.fields.manufacturer">
        <CategoryFilters
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :renderKey="key"
        />
      </template>

      <template v-if="key === 'price' && content?.fields.price">
        <CategoryFilters
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :renderKey="key"
        />
      </template>

      <template v-if="key === 'availability' && content?.fields.availability">
        <CategoryFilters
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :renderKey="key"
        />
      </template>

      <template v-if="key === 'customizedFilters' && content?.fields.customizedFilters">
        <CategoryFilters
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :renderKey="key"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';
import type { SortFilterProps } from './types';

const { data: productsCatalog } = useProducts();

const props = defineProps<SortFilterProps>();
</script>
