<template>
  <UiButton class="mt-4 w-full cursor-pointer" variant="secondary" @click="handleTrackingUrl()">
    {{ t('orderConfirmation.trackingOrder', {
      trackingNumber: order.order.tracking?.trackingNumbers[0]
    }) }}
  </UiButton>
</template>

<script setup lang="ts">
import type { OrderTrackingButtonProps } from './types';
import { orderGetters } from '@plentymarkets/shop-api';

const { t } = useI18n();
const { order } = defineProps<OrderTrackingButtonProps>();

const handleTrackingUrl = () => {
  if (order.order.tracking?.trackingURLs.length && !(order.order.tracking.trackingURLs.length > 1)) {
    window.open(orderGetters.getOrderTrackingUrl(order));
  }
};
</script>
