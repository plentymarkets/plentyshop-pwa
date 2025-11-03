<template>
  <div v-if="showSortAndFilter" data-testid="category-sort-filter">
    <CategorySidebar class="sidebar w-full" :is-open="isOpen" @close="close">
      <template v-for="key in props.content?.filtersOrder" :key="key">
        <template v-if="key === 'category' && props.content?.fields.category">
          <CategoryTree v-if="productsCatalog.category" :category="productsCatalog.category" />
        </template>

        <template v-if="key === 'sortBy' && props.content?.fields.sortBy">
          <CategorySorting class="mb-6" />
        </template>

        <template v-if="key === 'perPage' && props.content?.fields.perPage">
          <CategoryItemsPerPage class="mb-6" :total-products="productsCatalog.pagination?.totals ?? 0" />
        </template>

        <template v-if="key === 'itemRating' && props.content?.fields.itemRating">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'manufacturer' && props.content?.fields.manufacturer">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'price' && props.content?.fields.price">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'availability' && props.content?.fields.availability">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'customizedFilters' && props.content?.fields.customizedFilters">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>
      </template>
    </CategorySidebar>

    <UiButton variant="tertiary" class="md:hidden whitespace-nowrap" @click="open">
      <template #prefix>
        <SfIconTune />
      </template>
      {{ t('listSettings') }}
    </UiButton>
  </div>

  <template v-else>
    <h2 v-if="clientPreview" class="text-center">{{ getEditorTranslation('no-sorting-or-filter-text') }}</h2>
  </template>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/shop-api';
import type { SortFilterProps, SortFilterFieldsVisibility } from './types';
import { SfIconTune, useDisclosure } from '@storefront-ui/vue';

const { data: productsCatalog } = useProducts();

const props = defineProps<SortFilterProps>();

const showSortAndFilter = ref(false);
const { isOpen, open, close } = useDisclosure();
const { t } = useI18n({ useScope: 'global' });
const clientPreview = ref(false);

const { $isPreview } = useNuxtApp();
onNuxtReady(() => {
  clientPreview.value = !!$isPreview;
});
watch(
  () => props.content?.fields,
  (newValue) => {
    showSortAndFilter.value = !!newValue && Object.values(newValue as SortFilterFieldsVisibility).some(Boolean);
  },
  { deep: true, immediate: true },
);
</script>

<i18n lang="json">
{
  "en": {
    "no-sorting-or-filter-text": "You do not have any sorting or filter options enabled"
  },
  "de": {
    "no-sorting-or-filter-text": "You do not have any sorting or filter options enabled"
  }
}
</i18n>
