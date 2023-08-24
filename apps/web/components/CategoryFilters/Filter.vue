<template>
  <SfAccordionItem v-if="facet" v-model="open">
    <template #summary>
      <div class="flex justify-between p-2 mb-2">
        <p class="mb-2 font-medium typography-headline-5">{{ facetGetters.getName(facet) }}</p>
        <SfIconChevronLeft :class="['text-neutral-500', open ? 'rotate-90' : '-rotate-90']" />
      </div>
    </template>

    <div v-if="facetGetters.getType(facet) === 'feedback'">
      <!-- <SfListItem
        v-for="(filter, index) in facetGetters.getFilters(facet) as Filter[]"
        :key="index"
        tag="label"
        size="sm"
        class="!items-center py-4 md:py-1 px-1.5 bg-transparent hover:bg-transparent"
      >
        <template #prefix>
          <SfRadio class="flex items-center" :checked="filter.selected ?? false" />
        </template>
        <div class="flex flex-wrap items-center">
          <SfRating class="-mt-px" :value="Number(filter.id.toString().replace('feedback-', ''))" :max="5" size="sm" />
          <span :class="['mx-2 text-base md:text-sm']">{{
            Number(filter.id.toString().replace('feedback-', ''))
          }}</span>
          <SfCounter size="sm">{{ filter.count }}</SfCounter>
        </div>
      </SfListItem> -->
    </div>

    <div class="mb-4" v-else-if="facetGetters.getType(facet) === 'price'">
      <form @submit.prevent="updatePriceFilter">
        <div class="mb-3">
          <SfInput v-model="minPrice" :placeholder="$t('min')" />
        </div>
        <div class="mb-3">
          <SfInput v-model="maxPrice" :placeholder="$t('max')" />
        </div>
        <SfButton type="submit" :disabled="minPrice.length === 0 && maxPrice.length === 0" variant="secondary">
          <template #prefix>
            <SfIconCheck />
          </template>
          {{ $t('apply') }}
        </SfButton>
        <SfButton type="reset" @click="resetPriceFilter" class="float-right" variant="secondary">
          <template #prefix>
            <SfIconDelete />
          </template>
          {{ $t('clear') }}
        </SfButton>
      </form>
    </div>

    <div class="mb-4" v-else>
      <SfListItem
        v-for="(filter, index) in facetGetters.getFilters(facet) as Filter[]"
        :key="index"
        tag="label"
        size="sm"
        :class="['px-1.5 bg-transparent hover:bg-transparent']"
      >
        <template #prefix>
          <SfCheckbox class="flex items-center" :value="filter" v-model="models[filter.id]" @change="facetChange" />
        </template>
        <p>
          <span class="mr-2 text-sm">{{ filter.name ?? '' }}</span>
          <SfCounter size="sm">{{ filter.count ?? 0 }}</SfCounter>
        </p>
      </SfListItem>
    </div>
  </SfAccordionItem>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { Filter } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import { FilterGroup } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { facetGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import {
  SfInput,
  SfIconCheck,
  SfIconDelete,
  SfButton,
  SfAccordionItem,
  SfIconChevronLeft,
  SfListItem,
  SfCheckbox,
  SfCounter,
} from '@storefront-ui/vue';
import type { FilterProps } from '~/components/CategoryFilters/types';
import { useCategoryFilter, Filters } from '~/composables';

const route = useRoute();
const { getFacetsFromURL, updateFilters, updatePrices } = useCategoryFilter();
const open = ref(true);
const props = defineProps<FilterProps>();
const filters = facetGetters.getFilters(props.facet ?? ({} as FilterGroup)) as Filter[];
const models: Filters = {};
const currentFacets = computed(() => getFacetsFromURL().facets?.split(',') ?? []);

// Price
const minPrice = ref(getFacetsFromURL().priceMin ?? '');
const maxPrice = ref(getFacetsFromURL().priceMax ?? '');

function updatePriceFilter() {
  const min = minPrice.value.length > 0 ? Number(minPrice.value) : Number.NaN;
  const max = maxPrice.value.length > 0 ? Number(maxPrice.value) : Number.NaN;
  const minValue = Number.isNaN(min) ? '' : min.toString();
  const maxValue = Number.isNaN(max) ? '' : max.toString();

  updatePrices(minValue, maxValue);
}

function resetPriceFilter() {
  updatePrices('', '');
}

const updateFilter = () => {
  for (const filter of filters) {
    models[filter.id.toString()] = Boolean(filter.selected) ?? false;

    if (currentFacets.value.includes(filter.id.toString())) {
      models[filter.id.toString()] = true;
    }
  }
};

const facetChange = () => {
  updateFilters(models);
};

updateFilter();

watch(
  () => route.query,
  async () => {
    updateFilter();

    minPrice.value = getFacetsFromURL().priceMin ?? '';
    maxPrice.value = getFacetsFromURL().priceMax ?? '';
  },
);
</script>
