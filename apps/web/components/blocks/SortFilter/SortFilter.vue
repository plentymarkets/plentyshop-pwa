<template>
  <div data-testid="category-sort-filter">
    <template v-for="key in props.content?.filtersOrder" :key="key">
      <template v-if="key === 'category' && props.content?.fields.category">
        <CategoryTree v-if="productsCatalog.category" :category="productsCatalog.category" />
      </template>

      <template v-if="key === 'sortBy' && props.content?.fields.sortBy">
        <CategorySorting />
      </template>

      <template v-if="key === 'perPage' && props.content?.fields.perPage">
        <CategoryItemsPerPage
          class="mt-6"
          :total-products="productsCatalog.pagination?.totals ?? 0"
          :configuration="content"
        />
      </template>

      <template v-if="key === 'itemRating' && props.content?.fields.itemRating">
        <CategoryFiltersSort
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :render-key="key"
        />
      </template>

      <template v-if="key === 'manufacturer' && props.content?.fields.manufacturer">
        <CategoryFiltersSort
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :render-key="key"
        />
      </template>

      <template v-if="key === 'price' && props.content?.fields.price">
        <CategoryFiltersSort
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :render-key="key"
        />
      </template>

      <template v-if="key === 'availability' && props.content?.fields.availability">
        <CategoryFiltersSort
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :render-key="key"
        />
      </template>

      <template v-if="key === 'customizedFilters' && props.content?.fields.customizedFilters">
        <CategoryFiltersSort
          v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
          :facets="productsCatalog.facets"
          :configuration="content"
          :render-key="key"
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
