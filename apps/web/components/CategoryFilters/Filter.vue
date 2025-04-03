<template>
  <SfAccordionItem v-if="facet" v-model="open">
    <template #summary>
      <div class="flex justify-between p-2 mb-2 select-none">
        <p class="mb-2 font-medium typography-headline-5">{{ facetGetters.getName(facet) }}</p>
        <SfIconChevronLeft :class="['text-neutral-500', open ? 'rotate-90' : '-rotate-90']" />
      </div>
    </template>
    <div v-if="facetGetters.getType(facet) === 'feedback'">
      <SfListItem v-for="(filter, index) in sortedReviews(facet)" :key="index" tag="label" class="mb-3" size="sm">
        <div class="flex items-center space-x-2 justify-between">
         <div class="flex items-center">
           <SfCheckbox
             :id="filter.id"
             :model-value="isFilterActive(filter.id)"
             @update:model-value="toggleFilter(filter.id)"
           />
           <SfRating class="ml-2" :value="feedbackValue(filter)" :max="5" />
           <span class="ml-2 text-base font-medium">{{ feedbackValue(filter) }}</span>
         </div>

          <SfIconArrowUpward  v-if="feedbackValue(filter) != 5" size="sm" />
          <SfCounter class="ml-1">{{ filter.count }}</SfCounter>
         </div>
      </SfListItem>
    </div>

    <form v-else-if="facetGetters.getType(facet) === 'price'" class="mb-4" @submit.prevent="handlePriceSubmit">
      <div class="mb-3">
        <SfInput
          :model-value="localPrice.priceMin"
          :placeholder="$t('min')"
          @input="updateLocalPrice($event, 'priceMin')"
        />
      </div>
      <div class="mb-3">
        <SfInput
          :model-value="localPrice.priceMax"
          :placeholder="$t('max')"
          @input="updateLocalPrice($event, 'priceMax')"
        />
      </div>
      <div class="flex">
        <UiButton type="submit" class="w-full mr-3 h-10" variant="secondary">
          {{ $t('apply') }}
        </UiButton>
        <UiButton type="button" class="h-10" variant="secondary" @click="resetPrice">
          {{ $t('clear') }}
        </UiButton>
      </div>
    </form>

    <div v-else class="mb-4">
      <SfListItem
        v-for="(filter, index) in facetGetters.getFilters(facet)"
        :key="index"
        tag="label"
        size="sm"
        :data-testid="'category-filter-' + index"
        class="px-1.5 bg-transparent hover:bg-transparent"
      >
        <template #prefix>
          <SfCheckbox
            :id="filter.id.toString()"
            :model-value="isFilterActive(filter.id)"
            @update:model-value="toggleFilter(filter.id)"
          />
        </template>
        <p class="select-none">
          <span class="mr-2 text-sm">{{ filter.name }}</span>
          <SfCounter size="sm">{{ filter.count }}</SfCounter>
        </p>
      </SfListItem>
    </div>
  </SfAccordionItem>
</template>

<script setup lang="ts">
import { type Filter, type FilterGroup, facetGetters } from '@plentymarkets/shop-api';
import { SfAccordionItem, SfCheckbox, SfCounter, SfRating, SfInput, SfListItem, SfIconChevronLeft, SfIconArrowUpward } from '@storefront-ui/vue';

defineProps<{
  facet: FilterGroup;
}>();

const {
  activeFilters,
  priceRange,
  updateFilter,
  updatePrice,
  resetPriceFilter
} = useProductFilters();

const open = ref(true);
const localPrice = ref({ priceMin: '', priceMax: '' });

const isFilterActive = (id: string | number) =>
  activeFilters.value.includes(id.toString());

const toggleFilter = (id: string | number) => {
  updateFilter(id.toString());
};

const updateLocalPrice = (event: Event, type: 'priceMin' | 'priceMax') => {
  const input = event.target as HTMLInputElement;
  const sanitizedValue = input.value
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*)\./g, '$1');

  input.value = sanitizedValue;
  localPrice.value[type] = sanitizedValue;
};

const handlePriceSubmit = () => {
  updatePrice(localPrice.value.priceMin, localPrice.value.priceMax);
};

const resetPrice = () => {
  localPrice.value = { priceMin: '', priceMax: '' };
  resetPriceFilter();
};

const feedbackValue = (filter: Filter) =>
  Number(filter.id.toString().replace('feedback-', ''));

localPrice.value = {
  priceMin: priceRange.value.priceMin || '',
  priceMax: priceRange.value.priceMax || ''
};
const sortedReviews = (facet: FilterGroup): Filter[] =>
  facetGetters.getFilters(facet).sort((a, b) => feedbackValue(b) - feedbackValue(a));
</script>
