<template>
  <div class="py-2 mb-6≈" data-testid="category-filters">
    <CategoryFiltersFilter v-for="facet in facets" :key="facet.id" :facet="facet" />
  </div>
</template>

<script setup lang="ts">
import type { CategoryFiltersProps } from '~/components/CategoryFilters/types';

const props = defineProps<CategoryFiltersProps>();

const { data: productsCatalog } = useProducts();

const facets = computed(() => productsCatalog.value.facets || props.facets || []);
</script>
