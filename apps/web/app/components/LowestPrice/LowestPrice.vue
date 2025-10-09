<template>
  <div v-if="showLowestPrice" class="text-sm mb-2">
    {{ t('lowestPrice', { price: format(lowestPrice) }) }}
  </div>
</template>

<script setup lang="ts">
import { productGetters, productPriceGetters } from '@plentymarkets/shop-api';
import type { LowestPriceProps } from '~/components/LowestPrice/types';

const props = defineProps<LowestPriceProps>();
const { format } = usePriceFormatter();
const { t } = useI18n();

const lowestPrice = computed(() => Number(productGetters.getLowestPrice(props.product)));

const hasCrossPrice = computed(() => {
  const price = productPriceGetters.getPrice(props.product);
  const rrp = productPriceGetters.getCrossedPrice(props.product);
  const special = productPriceGetters.getSpecialOffer(props.product);

  const hasRrpPrice = rrp !== null && price !== null && rrp > price;
  const hasBeforePrice = special !== null && price !== null && price > special;

  return hasRrpPrice || hasBeforePrice;
});

const showLowestPrice = computed(() => lowestPrice.value && hasCrossPrice.value);
</script>
