<template>
  <div class="text-black g-16 lg:g-18 mb-3 mt-10">
    {{ $t('account.ordersAndReturns.paymentSummary.heading') }}
  </div>

  <h2 class="font-medium text-base">{{ $t('billing.heading') }}</h2>
  <p v-if="sameAsShippingAddress">{{ $t('orderConfirmation.sameAsShippingAddress') }}</p>
  <OrderAddressData v-if="billingAddress && !sameAsShippingAddress" :address="billingAddress" />

  <h2 class="font-medium text-base mt-4">{{ $t('checkoutPayment.heading') }}</h2>
  <p>{{ orderGetters.getPaymentMethodName(order) }}</p>

  <h2 class="font-medium text-base mt-4">{{ $t('account.ordersAndReturns.paymentSummary.paymentStatus') }}</h2>
  <p data-testid="order-payment-status">{{ $t(orderGetters.getPaymentStatusKey(order)) }}</p>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import type { OrderPaymentSummaryPropsType } from './types';

const props = defineProps<OrderPaymentSummaryPropsType>();
const shippingAddress = orderGetters.getShippingAddress(props.order);
const billingAddress = orderGetters.getBillingAddress(props.order);
const sameAsShippingAddress = shippingAddress && billingAddress && shippingAddress.id === billingAddress.id;
</script>
