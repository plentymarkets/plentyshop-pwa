<template>
  <div class="text-sm py-1">
    <span class="mr-2 text-secondary-500 font-bold text-2xl" data-testid="price">
      <span v-if="price">{{ price }}</span>
      <span v-else>{{ t('priceNotAvailable') }}</span>
      <span>{{ t('asterisk') }} </span>
    </span>
    <span
      v-if="crossedPrice && typeof crossedPriceValue === 'number' && crossedPriceValue > 0"
      class="text-base font-normal text-neutral-500 line-through"
    >
      <span>{{ crossedPrice }}</span>
    </span>
    <span v-else-if="typeof crossedPriceValue === 'number' && crossedPriceValue > 0">{{
      n(crossedPriceValue, 'currency')
    }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

defineProps<PriceProps>();

const { t, n } = useI18n();
</script>
