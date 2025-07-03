<template>
  <div class="font-bold text-primary-500 md:text-lg mb-3">
    {{ t('account.ordersAndReturns.shippingSummary.heading') }}
  </div>
  <h2 class="font-medium text-base">{{ t('account.ordersAndReturns.shippingSummary.shipTo') }}</h2>
  <OrderAddressData v-if="shippingAddress" :address="shippingAddress" />

  <template v-if="shippingMethod">
    <h2 class="font-medium text-base mt-4">
      {{ t('account.ordersAndReturns.shippingSummary.shippingMethod') }}
    </h2>
    <p>{{ shippingMethod }}</p>
  </template>

  <OrderTrackingButton :order="order" />

  <template v-if="preferredDeliveryServices">
    <h2 class="font-medium text-base mt-4">
      {{ t('PreferredDelivery.general.assistantName') }}
    </h2>

    <ul class="space-y-1">
      <li v-for="(serviceValue, serviceName, index) in preferredDeliveryServices" :key="index">
        {{ `${serviceName}: ${serviceValue}` }}
      </li>
    </ul>
  </template>

  <template v-if="orderContactWish">
    <h2 class="font-medium text-base mt-4">{{ t('customerWish') }}</h2>
    <p>{{ orderContactWish }}</p>
  </template>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import type { OrderShippingSummaryPropsType } from './types';

const props = defineProps<OrderShippingSummaryPropsType>();

const { t } = useI18n();
const shippingAddress = orderGetters.getShippingAddress(props.order);
const shippingMethod = orderGetters.getShippingProvider(props.order);
const preferredDeliveryServices = orderGetters.getPreferredDeliveryServices(props.order);
const orderContactWish = orderGetters.getOrderContactWish(props.order);
</script>
