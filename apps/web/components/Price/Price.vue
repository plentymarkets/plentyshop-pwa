<template>
  <div class="text-sm py-1">
    <span class="mr-2 text-secondary-500 font-bold text-2xl" data-testid="price">
      <span v-if="typeof price === 'number'">{{ n(price, 'currency') }}</span>
      <span v-else>{{ price }}</span>
      <span>{{ t('asterisk') }} </span>
    </span>
    <span v-if="crossedPrice" class="text-base font-normal text-neutral-500 line-through">
      <span  v-if="typeof crossedPrice === 'number'">{{ $n(crossedPrice, 'currency') }}</span>
      <span v-else>{{ crossedPrice }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

defineProps<PriceProps>();

const { t, n } = useI18n();
</script>
