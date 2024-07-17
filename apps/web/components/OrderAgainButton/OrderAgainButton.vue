<template>
  <SfButton class="mt-4 w-full cursor-pointer" variant="secondary" @click="openOrderAgainModal(order)">
    {{ $t('account.ordersAndReturns.orderAgain.heading') }}
  </SfButton>
  <OrderAgain v-if="selectedOrder" :order="selectedOrder" />
</template>

<script setup lang="ts">
import type { OrderAgainButtonProps } from './types';
import { SfButton } from '@storefront-ui/vue';

defineProps<OrderAgainButtonProps>();

const { openOrderAgainModal, order: selectedOrder } = useOrderAgain();
</script>
