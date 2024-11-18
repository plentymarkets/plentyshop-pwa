<template>
  <SfAccordionItem v-if="facet" v-model="open">
    <template #summary>
      <div class="flex justify-between p-2 mb-2 select-none">
        <p class="mb-2 font-medium typography-headline-5">{{ facetGetters.getName(facet) }}</p>
        <SfIconChevronLeft :class="['text-neutral-500', open ? 'rotate-90' : '-rotate-90']" />
      </div>
    </template>
    <div v-if="facetGetters.getType(facet) === 'feedback'">
      <SfListItem
        v-for="(filter, index) in facetGetters.getFilters(facet).reverse() as Filter[]"
        :key="index"
        tag="label"
        size="sm">
        <div class="flex items-center">
          <SfCheckbox
            v-model="models[filter.id]"
            :value="filter"
            :id="filter.id"
            @change="facetChange"
            class="flex items-center mr-1"
          />
          <span>
            <template v-for="starId in 5" :key="starId">
              <SfIconStarFilled class="text-orange-300" v-if="starId <=  Number(filter.id.toString().replace('feedback-', ''))" ></SfIconStarFilled>
              <SfIconStar class="text-gray-400" v-else></SfIconStar>
            </template>

          <span :class="['mx-2 text-base ']">{{
            Number(filter.id.toString().replace('feedback-', ''))
          }}
          
          </span>
          <span class="mr-2" v-if="Number(filter.id.toString().replace('feedback-', '')) != 5">
            & up
          </span>
          </span>
          <SfCounter size="sm">{{ filter.count }}</SfCounter>
        </div>
      </SfListItem>
    </div>

    <form v-else-if="facetGetters.getType(facet) === 'price'" class="mb-4" @submit.prevent="updatePriceFilter">
      <div class="mb-3">
        <label for="min">
          <UiFormLabel class="text-start">{{ $t('min') }}</UiFormLabel>
          <SfInput v-model="minPrice" :placeholder="$t('min')" id="min" />
        </label>
      </div>
      <div class="mb-3">
        <label for="max">
          <UiFormLabel class="text-start">{{ $t('max') }}</UiFormLabel>
          <SfInput v-model="maxPrice" :placeholder="$t('max')" id="max" />
        </label>
      </div>
      <div class="flex">
        <UiButton
          type="submit"
          class="w-full mr-3 h-10"
          :disabled="minPrice.length === 0 && maxPrice.length === 0"
          variant="secondary"
        >
          <template #prefix>
            <SfIconCheck />
          </template>
          {{ $t('apply') }}
        </UiButton>
        <UiButton type="reset" @click="resetPriceFilter" class="h-10" variant="secondary">
          <SfIconClose />
        </UiButton>
      </div>
    </form>

    <div v-else class="mb-4">
      <SfListItem
        v-for="(filter, index) in facetGetters.getFilters(facet) as Filter[]"
        :key="index"
        tag="label"
        size="sm"
        :data-testid="'category-filter-' + index"
        class="px-1.5 bg-transparent hover:bg-transparent"
      >
        <template #prefix>
          <SfCheckbox
            v-model="models[filter.id]"
            :value="filter"
            :id="filter.id"
            @change="facetChange"
            class="flex items-center"
          />
        </template>
        <p class="select-none">
          <span class="mr-2 text-sm">{{ filter.name ?? '' }}</span>
          <SfCounter size="sm">{{ filter.count ?? 0 }}</SfCounter>
        </p>
      </SfListItem>
    </div>
  </SfAccordionItem>
</template>

<script setup lang="ts">
import { type Filter, type FilterGroup, facetGetters } from '@plentymarkets/shop-api';
import {
  SfInput,
  SfIconCheck,
  SfIconClose,
  SfAccordionItem,
  SfIconChevronLeft,
  SfRating,
  SfListItem,
  SfIconStar,
  SfIconStarFilled,
  SfCheckbox,
  SfCounter,
} from '@storefront-ui/vue';
import type { FilterProps } from '~/components/CategoryFilters/types';
import type { Filters } from '~/composables';

const route = useRoute();
const { getFacetsFromURL, updateFilters, updatePrices } = useCategoryFilter();
const open = ref(true);
const props = defineProps<FilterProps>();
const filters = facetGetters.getFilters(props.facet ?? ({} as FilterGroup)) as Filter[];
const models = ref({} as Filters);

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
  const currentFacets = getFacetsFromURL().facets?.split(',') ?? [];
  for (const filter of filters) {
    const filterId = typeof filter.id === 'string' ? filter.id : filter.id.toString();

    models.value[filterId] = currentFacets.includes(filterId);
  }
};

const facetChange = () => updateFilters(models.value);

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
