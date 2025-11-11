<template>
  <div class="flex flex-col gap-2">
    <CategoryFiltersSortSections
      v-for="facet in visibleFacets"
      :key="facet.id"
      :facet="facet"
      :configuration="content"
      :render-key="renderKey"
      v-bind="customizedFiltersProps"
    />
  </div>

  <div v-if="shouldShowShowAllButton">
    <button
      type="button"
      data-testid="add-page-btn"
      class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-2 text-editor-button"
      @click="isExpanded = true"
    >
      <SfIconExpandMore class="shrink-0" />
      {{ getEditorTranslation('show-all-filters') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';
import { SfIconExpandMore } from '@storefront-ui/vue';
import type { CategoryFiltersProps } from '~/components/CategoryFilters/types';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';

const props = defineProps<CategoryFiltersProps>();

const isExpanded = ref(false);

const content = computed(() => props.configuration || ({} as SortFilterContent));

const isCustomized = computed(() => props.renderKey === 'customizedFilters');

const showAllFromConfig = computed(() =>
  isCustomized.value ? (content.value.showAllFiltersImmediately ?? false) : false,
);
const limitFromConfig = computed(() => (isCustomized.value ? (content.value.numberOfFiltersToShowInitially ?? 0) : 0));

const customizedFiltersProps = computed(() => {
  if (!isCustomized.value) return {};
  return {
    showAll: showAllFromConfig.value,
    limit: limitFromConfig.value,
  };
});

const baseFacets = computed(() => {
  if (!isCustomized.value) {
    return props.facets;
  }
  return props.facets.filter((f) => facetGetters.getType(f) === 'dynamic');
});

const visibleFacets = computed(() => {
  if (!isCustomized.value) {
    return props.facets;
  }

  const all = baseFacets.value;
  const limit = props.limit ?? null;

  if (props.showAll || isExpanded.value) {
    return all;
  }

  if (limit === 0) {
    return [];
  }

  if (limit && limit > 0) {
    return all.slice(0, limit);
  }

  return all;
});

const shouldShowShowAllButton = computed(() => {
  if (!isCustomized.value) return false;
  if (props.showAll) return false;
  if (isExpanded.value) return false;
  if (!props.limit || props.limit <= 0) return false;
  return baseFacets.value.length > props.limit;
});

watch(
  () => [props.showAll, props.limit, props.renderKey],
  () => {
    isExpanded.value = false;
  },
);
</script>

<i18n lang="json">
{
  "en": {
    "show-all-filters": "Show all"
  },
  "de": {
    "show-all-filters": "Show all"
  }
}
</i18n>
