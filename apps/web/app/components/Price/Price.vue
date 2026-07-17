<template>
  <div class="text-sm py-1">
    <span
      class="mr-2 text-secondary-500 font-bold"
      :class="props.size === 'sm' ? 'typography-text-sm @sm:typography-text-lg' : 'text-2xl'"
      :data-testid="props.testId"
    >
      <span>{{ format(props.price) }}</span>
      <span v-if="props.displayVatHint">{{ t('common.labels.asterisk') }}</span>
    </span>
    <span v-if="props.crossedPrice && differentPrices" class="text-base font-normal text-neutral-500 line-through">
      {{ format(props.crossedPrice) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

const props = withDefaults(defineProps<PriceProps>(), {
  displayVatHint: true,
  size: 'base',
  testId: 'price',
});

const { format } = usePriceFormatter();

const differentPrices = computed(() => {
  return props.crossedPrice
    ? Math.round(props.price * 100) / 100 !== Math.round(props.crossedPrice * 100) / 100
    : false;
});
</script>
