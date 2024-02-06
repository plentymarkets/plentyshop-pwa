<template>
  <div class="font-bold text-primary-700 font-headings md:text-lg mb-3">
    <span v-if="!isReturn">
      {{ $t('account.ordersAndReturns.orderDetails.heading') }}
    </span>
    <span v-else>
      {{ $t('returns.detailsHeading') }}
    </span>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      <span v-if="!isReturn">
        {{ $t('account.ordersAndReturns.orderDetails.heading') }}
      </span>
      <span v-else>
        {{ $t('returns.detailsHeading') }}
      </span>
    </p>
    <p>{{ orderGetters.getId(order) }}</p>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      <span v-if="!isReturn">
        {{ $t('account.ordersAndReturns.orderDate') }}
      </span>
      <span v-else>
        {{ $t('account.ordersAndReturns.returnDate') }}
      </span>
    </p>
    <p>{{ orderGetters.getDate(order) }}</p>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 mb-2">
    <p class="font-medium text-base">
      {{ $t('account.ordersAndReturns.status') }}
    </p>
    <p>{{ orderGetters.getStatus(order) }}</p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { OrderDetailsProps } from './types';

const props = defineProps<OrderDetailsProps>();
const isReturn = orderGetters.getStatus(props.order) === 'Return';
</script>
