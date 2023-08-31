<template>
  <div class="text-sm" v-if="basePrice">
    <div>{{ $t('content') }}: {{ unitContent }} {{ unitName }}</div>
    <div>{{ $t('basePrice') }}: {{ $n(basePrice, 'currency') }}</div>
  </div>
</template>

<script setup lang="ts">
import { BasePriceProps } from '~/components/BasePrice/types';

const props = defineProps<BasePriceProps>();
const { basePrice, unitContent, unitName } = props;
</script>
