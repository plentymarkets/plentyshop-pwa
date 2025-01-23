<template>
  <div class="font-bold text-primary-500 md:text-lg mb-3">
    {{ $t('account.ordersAndReturns.shippingSummary.heading') }}
  </div>
  <h2 class="font-medium text-base">{{ $t('account.ordersAndReturns.shippingSummary.shipTo') }}</h2>
  <OrderAddressData v-if="shippingAddress" :address="shippingAddress" />

  <template v-if="shippingMethod">
    <h2 class="font-medium text-base mt-4">
      {{ $t('account.ordersAndReturns.shippingSummary.shippingMethod') }}
    </h2>
    <p>{{ shippingMethod }}</p>
  </template>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import type { OrderShippingSummaryPropsType } from './types';

const props = defineProps<OrderShippingSummaryPropsType>();

const shippingAddress = orderGetters.getShippingAddress(props.order);
const shippingMethod = orderGetters.getShippingProvider(props.order);
</script>
