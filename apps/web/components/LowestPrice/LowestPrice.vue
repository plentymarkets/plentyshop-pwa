<template>
  <div
    v-if="lowestPrice && productGetters.getPrice(product)?.special && productGetters.getRegularPrice(product) > 0"
    class="text-sm mb-2"
  >
    {{ $t('lowestPrice', { price: $n(lowestPrice, 'currency') }) }}
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { LowestPriceProps } from '~/components/LowestPrice/types';

const props = defineProps<LowestPriceProps>();
const lowestPrice = computed(() => productGetters.getLowestPrice(props.product));
</script>
