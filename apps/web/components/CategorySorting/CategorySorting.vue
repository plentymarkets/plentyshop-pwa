<template>
  <div class="w-full md:max-w-[376px]" data-testid="category-sorting">
    <h6
      class="bg-neutral-100 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ t('sortBy') }}
    </h6>
    <div class="px-4">
      <SfSelect id="sortBy" v-model="selected" :aria-label="t('sortBy')" @change="sortingChanged">
        <option v-for="{ value, label } in options" :key="value" :value="value">
          {{ t(`sortType.${label}`) }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const { getFacetsFromURL, updateSorting } = useCategoryFilter();
const { t } = useI18n();
const options = ref([
  {
    label: 'recommended',
    value: 'default.recommended_sorting',
  },
  {
    label: 'nameA-Z',
    value: 'texts.name1_asc',
  },
  {
    label: 'nameZ-A',
    value: 'texts.name1_desc',
  },
  {
    label: 'priceUp',
    value: 'sorting.price.avg_asc',
  },
  {
    label: 'priceDown',
    value: 'sorting.price.avg_desc',
  },
  {
    label: 'newest',
    value: 'variation.createdAt_desc',
  },
  {
    label: 'oldest',
    value: 'variation.createdAt_asc',
  },
  {
    label: 'availabilityUp',
    value: 'variation.availability.averageDays_asc',
  },
  {
    label: 'availabilityDown',
    value: 'variation.availability.averageDays_desc',
  },
  {
    label: 'variationNumberUp',
    value: 'variation.number_asc',
  },
  {
    label: 'variationNumberDown',
    value: 'variation.number_desc',
  },
  {
    label: 'lastUpdate',
    value: 'variation.updatedAt_asc',
  },
  {
    label: 'firstUpdate',
    value: 'variation.updatedAt_desc',
  },
  {
    label: 'manufacturerAsc',
    value: 'item.manufacturer.externalName_asc',
  },
  {
    label: 'manufacturerDesc',
    value: 'item.manufacturer.externalName_desc',
  },
  {
    label: 'topSellerUp',
    value: 'variation.position_asc',
  },
  {
    label: 'topSellerDown',
    value: 'variation.position_desc',
  },
  {
    label: 'reviewsUp',
    value: 'item.feedbackDecimal_asc',
  },
  {
    label: 'reviewsDown',
    value: 'item.feedbackDecimal_desc',
  },
]);
const selected = ref(options.value[0].value);

function sortingChanged() {
  updateSorting(selected.value);
}

function sortQueryChanged() {
  const facets = getFacetsFromURL();
  selected.value = facets.sort ?? options.value[0].value;
}

sortQueryChanged();

watch(
  () => useNuxtApp().$router.currentRoute.value.query.sort,
  () => {
    sortQueryChanged();
  },
);
</script>
