<template>
  <NuxtLink
    :to="item.url"
    class="border border-neutral-200 rounded-md h-full flex flex-col justify-between hover:shadow-lg"
    data-testid="search-suggestion-product"
  >
    <div>
      <div class="flex items-center justify-center aspect-[3/2]">
        <NuxtImg :src="item.image" :alt="item.imageAlt" class="object-contain rounded-md w-full h-full" />
      </div>
      <hr class="h-px bg-neutral-200 border-0" />
      <div class="px-2 pt-2">
        <div class="text-sm font-medium text-neutral-900 line-clamp-2">{{ item.label }}</div>
      </div>
    </div>
    <div class="text-sm px-2 pb-2 flex flex-wrap gap-x-2 items-center">
      <span class="text-gray-900 font-semibold">{{ format(itemSearchAutocompleteGetters.getPrice(item)) }}</span>
      <span v-if="crossedPrice && hasDifferentPrices" class="text-neutral-500 text-xs line-through">
        {{ format(crossedPrice) }}
      </span>
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
