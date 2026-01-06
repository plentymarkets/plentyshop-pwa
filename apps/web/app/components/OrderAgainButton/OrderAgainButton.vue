<template>
  <UiButton class="mt-4 w-full cursor-pointer" variant="secondary" @click="openOrderAgainModal(order)">
    {{ t('account.ordersAndReturns.orderAgain.heading') }}
  </UiButton>
  <OrderAgain v-if="selectedOrder" :order="selectedOrder" />
</template>

<script setup lang="ts">
import type { OrderAgainButtonProps } from './types';

defineProps<OrderAgainButtonProps>();

const { t } = useI18n();
const { openOrderAgainModal, order: selectedOrder } = useOrderAgain();
</script>
