<template v-if="basePrice">
  <div class="text-sm">{{ $t('content') }}: {{ unitContent }} {{ unitName }}</div>
  <div class="text-sm">{{ $t('basePrice') }}: {{ $n(basePrice2Digit, 'currency') }} / {{ unitName }}</div>
</template>

<script setup lang="ts">
import type { BasePriceProps } from '~/components/BasePrice/types';

const props = defineProps<BasePriceProps>();
const basePrice2Digit = computed(() => (props.basePrice ? Number(props.basePrice.toFixed(2)) : 0));
</script>
