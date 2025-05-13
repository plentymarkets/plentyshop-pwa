<template>
  <div class="font-bold text-primary-500 md:text-lg mb-3">
    <span v-if="!orderGetters.isReturn(order)">
      {{ $t('account.ordersAndReturns.orderDetails.heading') }}
    </span>
    <span v-else>
      {{ $t('returns.detailsHeading') }}
    </span>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      <span v-if="!orderGetters.isReturn(order)">
        {{ $t('account.ordersAndReturns.orderNumber') }}
      </span>
      <span v-else>
        {{ $t('returns.returnNumber') }}
      </span>
    </p>
    <p>{{ orderGetters.getId(order) }}</p>
  </div>
  <div v-if="orderGetters.isReturn(order)" class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">{{ $t('account.ordersAndReturns.orderNumber') }}</p>
    <p>{{ orderGetters.getOrderReferenceOriginId(order) }}</p>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      <span v-if="!orderGetters.isReturn(order)">
        {{ $t('account.ordersAndReturns.orderDate') }}
      </span>
      <span v-else>
        {{ $t('account.ordersAndReturns.returnDate') }}
      </span>
    </p>
    <p>{{ orderGetters.getDate(order, locale) }}</p>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      {{ $t('account.ordersAndReturns.status') }}
    </p>
    <p>{{ orderGetters.getStatus(order) }}</p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import type { OrderDetailsProps } from './types';
const { locale } = useI18n();

defineProps<OrderDetailsProps>();
</script>
