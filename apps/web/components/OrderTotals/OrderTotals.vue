<template>
  <div v-for="(additionalCost, index) in additionalCostsWithoutTax" :key="index" class="grid grid-cols-2">
    <p class="text-base">{{ orderGetters.getOrderItemOrderPropertyName(additionalCost) }}:</p>
    <p class="text-right">{{ n(orderGetters.getOrderItemOrderPropertySurcharge(additionalCost), 'currency') }}</p>
  </div>
  <UiDivider v-if="additionalCostsWithoutTax.length > 0" class="mt-2 mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.subTotal') }}:</p>
    <p class="text-right">{{ n(orderGetters.getSubTotal(order.totals), 'currency') }}</p>
  </div>
  <div class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.shipping') }}:</p>
    <p class="text-right">{{ getShippingAmount(orderGetters.getShippingCost(order) ?? 0) }}</p>
  </div>
  <div class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('coupon.name') }}:</p>
    <p class="text-right">{{ n(orderGetters.getCouponValue(order.totals), 'currency') }}</p>
  </div>
  <div v-for="(vat, index) in orderGetters.getOrderVats(order)" :key="index" class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.vat') }} ({{ orderGetters.getOrderVatRate(vat) }}%):</p>
    <p class="text-right">{{ n(orderGetters.getOrderVatValue(vat), 'currency') }}</p>
  </div>
  <UiDivider v-if="additionalCostsWithTax.length > 0" class="mt-2 mb-2" />
  <div v-for="(additionalCost, index) in additionalCostsWithTax" :key="index" class="grid grid-cols-2">
    <p class="text-base">{{ orderGetters.getOrderItemOrderPropertyName(additionalCost) }}:</p>
    <p class="text-right">{{ n(orderGetters.getOrderItemOrderPropertySurcharge(additionalCost), 'currency') }}</p>
  </div>
  <UiDivider class="mt-2 mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base" :class="{ 'font-bold text-xl': isOrderTypeOffer }">
      {{ t('orderConfirmation.total') }}:
    </p>
    <p class="text-right" :class="{ 'font-bold text-xl': isOrderTypeOffer }">
      {{ n(orderGetters.getTotal(order.totals), 'currency') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters, offerGetters } from '@plentymarkets/shop-api';
import type { OrderTotalsPropsType } from './types';

const props = defineProps<OrderTotalsPropsType>();
const { t, n } = useI18n();

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shippingMethod.free') : n(Number(amount), 'currency');
};

const isOrderTypeOffer = offerGetters.isTypeOffer(props.order);
const additionalCostsWithoutTax = orderGetters.getAdditionalCostsWithTax(props.order);
const additionalCostsWithTax = orderGetters.getAdditionalCostsWithoutTax(props.order);
</script>
