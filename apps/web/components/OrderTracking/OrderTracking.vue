<template>
  <div v-if="trackingUrl" class="mt-4">
    <p class="font-medium text-base text-gray-900 mb-1">
      {{ t('orderConfirmation.trackingOrder') }}
    </p>
    <p>
      <span v-for="(number, index) in trackingNumbers" :key="index">
        <NuxtLink :to="trackingUrl">
          {{ number }}
        </NuxtLink>
        <span v-if="index < trackingNumbers.length - 1">, </span>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import type { OrderTrackingProps } from './types';

const { t } = useI18n();
const { order } = defineProps<OrderTrackingProps>();

const trackingNumbers = computed(() => orderGetters.getOrderTrackingNumbers(order));
const trackingUrl = computed(() => orderGetters.getOrderTrackingUrl(order));
</script>
