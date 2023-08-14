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

    <div class="mb-4" v-else-if="facetGetters.getType(facet) === 'price'"></div>

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
import { facetGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfAccordionItem, SfIconChevronLeft, SfListItem, SfCheckbox, SfCounter } from '@storefront-ui/vue';
import type { FilterProps } from '~/components/CategoryFilters/types';
import { useCategoryFilter, Filters } from '~/composables';

const route = useRoute();
const { getFacetsFromURL, updateFilters } = useCategoryFilter();
const open = ref(true);
const props = defineProps<FilterProps>();
const filters = facetGetters.getFilters(props.facet) as Filter[];
const models: Filters = {};
const currentFacets = computed(() => getFacetsFromURL().facets?.split(',') ?? []);

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
  () => route.query.facets,
  async () => {
    updateFilter();
  },
);
</script>
