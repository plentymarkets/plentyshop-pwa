<template>
  <template v-if="basePrice">
    <div class="text-sm">{{ t('content') }}: {{ unitContent }} {{ unitName }}</div>
    <div class="text-sm">{{ t('basePrice') }}: {{ basePrice }}</div>
  </template>
</template>

<script setup lang="ts">
import type { BasePriceProps } from '~/components/BasePrice/types';

defineProps<BasePriceProps>();
</script>
