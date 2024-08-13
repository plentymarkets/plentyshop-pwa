<template>
  <div v-if="showLowestPrice" class="text-sm mb-2">
    {{ $t('lowestPrice', { price: $n(lowestPrice, 'currency') }) }}
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { LowestPriceProps } from '~/components/LowestPrice/types';
import { useProductPrice } from '~/composables/useProductPrice';

const props = defineProps<LowestPriceProps>();

const { price } = useProductPrice(props.product);

const lowestPrice = computed(() => Number(productGetters.getLowestPrice(props.product)));

const showLowestPrice = computed(() => lowestPrice.value && price.value && lowestPrice.value < price.value);
</script>
