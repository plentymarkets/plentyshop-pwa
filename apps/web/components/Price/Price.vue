<template>
  <div class="text-sm">
    <div class="my-1">
      <span class="mr-2 text-secondary-700 font-bold font-headings text-2xl" data-testid="price">
        {{ $n(mainPrice, 'currency') }}
      </span>
      <span v-if="oldPrice && oldPrice !== mainPrice" class="text-base font-normal text-neutral-500 line-through">
        {{ $n(oldPrice, 'currency') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PriceProps } from '~/components/Price/types';

const props = defineProps<PriceProps>();
const { price } = props;

const mainPrice = computed<number>(() => {
  if (!price) return 0;

  if (price.special) return price.special;
  if (price.regular) return price.regular;

  return 0;
});
const oldPrice = computed<number>(() => price.regular ?? 0);
</script>
