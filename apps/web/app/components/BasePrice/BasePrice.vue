<template>
  <template v-if="basePrice">
    <div class="text-sm">{{ t('common.labels.content') }}: {{ unitContent }} {{ unitName }}</div>
    <div class="text-sm">{{ t('common.labels.basePrice') }}: {{ basePrice }}</div>
  </template>
</template>

<script setup lang="ts">
import type { BasePriceProps } from '~/components/BasePrice/types';

defineProps<BasePriceProps>();
</script>
