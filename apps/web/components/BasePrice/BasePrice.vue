<template>
  <div v-if="basePrice">
    <div class="text-sm">{{ t('content') }}: {{ unitContent }} {{ unitName }}</div>
    <div class="text-sm">{{ t('basePrice') }}: {{ basePrice }}</div>
  </div>
</template>

<script setup lang="ts">
import type { BasePriceProps } from '~/components/BasePrice/types';

const { t } = useI18n();

defineProps<BasePriceProps>();
</script>
