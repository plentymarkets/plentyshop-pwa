<template>
  <div class="text-sm">
    <div class="my-1">
      <span class="mr-2 text-secondary-700 font-bold font-headings text-2xl" data-testid="price">
        {{ $n(actualPrice, 'currency') }}
      </span>
      <span v-if="price.special && regularPrice" class="text-base font-normal text-neutral-500 line-through">
        {{ $n(regularPrice, 'currency') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PriceProps } from '~/components/Price/types';

const props = defineProps<PriceProps>();
const { price } = props;

const actualPrice = computed(() => {
  if (price && (price.special !== null || price.regular !== null)) {
    return price.special ?? price.regular ?? 0;
  }
  return 0;
});
const regularPrice = computed<number>(() => price.regular ?? 0);
</script>
