<template>
  <div v-for="(additionalCost, index) in additionalCostsWithoutTax" :key="index" class="grid grid-cols-2">
    <p class="text-base">{{ orderGetters.getOrderItemOrderPropertyName(additionalCost) }}:</p>
    <p class="text-right">{{ format(orderGetters.getOrderItemOrderPropertySurcharge(additionalCost)) }}</p>
  </div>
  <UiDivider v-if="additionalCostsWithoutTax.length > 0" class="mt-2 mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.subTotal') }}:</p>
    <p v-if="showNetPrices" class="text-right">{{ format(order.totals.itemSumNet) }}</p>
    <p v-else class="text-right">{{ format(orderGetters.getSubTotal(order.totals)) }}</p>
  </div>
  <div class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.shipping') }}:</p>
    <p v-if="showNetPrices" class="text-right">{{ getShippingAmount(order.totals.shippingNet ?? 0) }}</p>
    <p v-else class="text-right">{{ getShippingAmount(orderGetters.getShippingCost(order) ?? 0) }}</p>
  </div>
  <div v-if="orderGetters.getCouponValue(order.totals) < 0" class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('coupon.name') }}:</p>
    <p class="text-right">{{ format(orderGetters.getCouponValue(order.totals)) }}</p>
  </div>
  <div v-for="(vat, index) in orderGetters.getOrderVats(order)" :key="index" class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.vat') }} ({{ orderGetters.getOrderVatRate(vat) }}%):</p>
    <p class="text-right">
      {{ showNetPrices ? t('orderProperties.vat.excl') : t('orderProperties.vat.incl') }}
      {{ format(orderGetters.getOrderVatValue(vat)) }}
    </p>
  </div>
  <UiDivider v-if="additionalCostsWithTax.length > 0" class="mt-2 mb-2" />
  <div v-for="(additionalCost, index) in additionalCostsWithTax" :key="index" class="grid grid-cols-2">
    <p class="text-base">{{ orderGetters.getOrderItemOrderPropertyName(additionalCost) }}:</p>
    <p class="text-right">{{ format(orderGetters.getOrderItemOrderPropertySurcharge(additionalCost)) }}</p>
  </div>
  <UiDivider class="mt-2 mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base" :class="{ 'font-bold text-xl': isOrderTypeOffer }">
      {{ t('orderConfirmation.total') }}:
    </p>
    <p class="text-right" :class="{ 'font-bold text-xl': isOrderTypeOffer }">
      {{ showNetPrices ? format(orderGetters.getTotalNet(order.totals)) : format(orderGetters.getTotal(order.totals)) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters, offerGetters } from '@plentymarkets/shop-api';
import type { OrderTotalsPropsType } from './types';

const props = defineProps<OrderTotalsPropsType>();
const { t } = useI18n();
const { format } = usePriceFormatter();
const { showNetPrices } = useCustomer();

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shippingMethod.free') : format(Number(amount));
};

const isOrderTypeOffer = offerGetters.isTypeOffer(props.order);
const additionalCostsWithoutTax = orderGetters.getAdditionalCostsWithTax(props.order);
const additionalCostsWithTax = orderGetters.getAdditionalCostsWithoutTax(props.order);
</script>
