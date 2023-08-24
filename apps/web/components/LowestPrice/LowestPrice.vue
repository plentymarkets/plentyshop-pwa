<template>
  <div v-if="lowestPrice && lowestPrice.value" class="text-sm mb-4">
    Lowest price of the last 30 days: {{ $n(lowestPrice.value, 'currency') }}
  </div>
</template>

<script setup lang="ts">
import type { Product, Price } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { LowestPriceProps } from '~/components/LowestPrice/types';

const getLowestPrice = (product: Product): Price | null => {
  return product.prices?.default?.lowestPrice ?? null;
};

const props = defineProps<LowestPriceProps>();
const lowestPrice = computed(() => getLowestPrice(props.product));
</script>
