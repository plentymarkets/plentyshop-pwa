<template>
  <div class="text-sm mr-1" v-if="basePrice">
    {{ unitContent }} {{ unitName }} | {{ $n(basePrice2Digit, 'currency') }} / {{ unitName }}
  </div>
</template>

<script setup lang="ts">
import type { BasePriceProps } from '~/components/BasePrice/types';

const props = defineProps<BasePriceProps>();
const { basePrice, unitContent, unitName } = props;
const basePrice2Digit = basePrice ? Number(basePrice.toFixed(2)) : 0;
</script>
