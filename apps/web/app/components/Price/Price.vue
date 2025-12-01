<template>
  <div class="text-sm py-2">
    <div v-if="crossedPrice && differentPrices && discountPercent > 0" class="text-base font-normal text-red-600">
      <span class="line-through">{{ format(crossedPrice) }}</span> {{ t('rrp') }}
    </div>
    <span v-if="crossedPrice && differentPrices && discountPercent > 0" class="mr-2 bg-red-600 text-white px-2 py-1 text-lg" >
        -{{ discountPercent }}%
    </span>
    <span class="mr-2 text-secondary-500 font-bold text-2xl" data-testid="price">
      <span>{{ format(price) }}</span>
      <span>{{ t('asterisk') }} </span>
    </span>

  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

const props = defineProps<PriceProps>();

const { format } = usePriceFormatter();
const { t } = useI18n();

const differentPrices = computed(() => {
  return props.crossedPrice
    ? Math.round(props.price * 100) / 100 !== Math.round(props.crossedPrice * 100) / 100
    : false;
});

const discountPercent = computed(() => {
  if (!props.crossedPrice || props.crossedPrice <= props.price) {
    return 0;
  }

  const diff = props.crossedPrice - props.price;
  const percent = (diff / props.crossedPrice) * 100;

  return Math.round(percent);
});
</script>
