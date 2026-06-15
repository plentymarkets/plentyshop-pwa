<template>
  <NuxtLink
    :to="item.url"
    class="group/card flex flex-col rounded-lg overflow-hidden ring-1 ring-neutral-200 transition-shadow duration-200 ease-out group-hover/card:shadow-card-hover hover:shadow-card-hover !no-underline"
    data-testid="search-suggestion-product"
  >
    <div class="aspect-[4/3] overflow-hidden">
      <NuxtImg
        :src="item.image"
        :alt="item.imageAlt"
        class="object-contain w-full h-full transition-transform duration-300 ease-out group-hover/card:scale-105"
      />
    </div>
    <div class="p-3 flex flex-col gap-1.5">
      <div
        class="text-sm font-medium leading-snug text-neutral-900 line-clamp-2 group-hover/card:underline underline-offset-2 decoration-1"
      >
        {{ item.label }}
      </div>
      <div class="flex items-baseline gap-2 tabular-nums">
        <span v-if="crossedPrice && hasDifferentPrices" class="text-xs text-neutral-400 line-through">
          {{ format(crossedPrice) }}
        </span>
        <span class="text-sm font-semibold text-neutral-900">
          {{ format(itemSearchAutocompleteGetters.getPrice(item)) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { itemSearchAutocompleteGetters } from '@plentymarkets/shop-api';
import type { SearchSuggestionProductProps } from './types';

const props = defineProps<SearchSuggestionProductProps>();
const { format } = usePriceFormatter();

const crossedPrice = computed(() => itemSearchAutocompleteGetters.getCrossedPrice(props.item));
const hasDifferentPrices = computed(() => itemSearchAutocompleteGetters.hasDifferentPrices(props.item));
</script>
