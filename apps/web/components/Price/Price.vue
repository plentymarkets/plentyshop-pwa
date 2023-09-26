<template>
  <div class="text-sm">
    <div class="my-1">
      <span class="mr-2 text-secondary-700 font-bold font-headings text-2xl" data-testid="price">
        {{ $n(price, 'currency') }}
        <span v-if="showNetPrices">{{ $t('asterisk') }} </span>
      </span>
      <span v-if="oldPrice && oldPrice !== price" class="text-base font-normal text-neutral-500 line-through">
        {{ $n(oldPrice, 'currency') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PriceProps } from '~/components/Price/types';

const props = defineProps<PriceProps>();
const { price, oldPrice } = props;

const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;
</script>
