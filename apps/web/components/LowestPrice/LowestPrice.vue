<template>
  <div
    v-if="lowestPrice && productGetters.getPrice(product)?.special && productGetters.getRegularPrice(product) > 0"
    class="text-sm mb-2"
  >
    {{ $t('lowestPrice', {price: $n(lowestPrice, 'currency')}) }}
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import type { LowestPriceProps } from '~/components/LowestPrice/types';

const getLowestPrice = (product: Product): number | null => {
  return product.prices?.default?.lowestPrice?.value ?? null;
};

const props = defineProps<LowestPriceProps>();
const lowestPrice = computed(() => getLowestPrice(props.product));
</script>
