<template>
  <h6
    class="py-2 px-4 mt-6 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest rounded-none select-none"
    data-testid="category-filters"
  >
    {{ t('filters') }}
  </h6>
  <div class="flex flex-col gap-2 px-4">
    <CategoryFiltersFilter v-for="facet in facets" :key="facet.id" :facet="facet" :configuration="content" :renderKey="renderKey"/>
  </div>
</template>

<script setup lang="ts">
import type { CategoryFiltersProps } from '~/components/CategoryFilters/types';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';

const props = defineProps<CategoryFiltersProps>();
const content = computed(() => props.configuration || ({} as SortFilterContent));

const { t } = useI18n();

const { facets } = toRefs(props);
const { renderKey } = toRefs(props);
</script>
