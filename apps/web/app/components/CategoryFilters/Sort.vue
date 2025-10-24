<template>
  <div class="flex flex-col gap-2">
    <CategoryFiltersSortSections
      v-for="facet in facets"
      :key="facet.id"
      :facet="facet"
      :configuration="content"
      :render-key="renderKey"
    />
  </div>
</template>

<script setup lang="ts">
import type { CategoryFiltersProps } from '~/components/CategoryFilters/types';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';

const props = defineProps<CategoryFiltersProps>();
const content = computed(() => props.configuration || ({} as SortFilterContent));
</script>
