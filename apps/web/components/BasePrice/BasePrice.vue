<template>
  <div class="text-sm" v-if="basePrice">
    <div>{{ $t('content') }}: {{ unitContent }} {{ unitName }}</div>
    <div>{{ $t('basePrice') }}: {{ $n(basePrice2Digit, 'currency') }} / {{ unitName }}</div>
  </div>
</template>

<script setup lang="ts">
import { BasePriceProps } from '~/components/BasePrice/types';

const props = defineProps<BasePriceProps>();
const { basePrice, unitContent, unitName } = props;
const basePrice2Digit = basePrice ? Number.parseFloat(basePrice.toFixed(2)) : 0;
</script>
