<template>
  <div v-for="(additionalCost, index) in additionalCostsWithoutTax" :key="index" class="grid grid-cols-2">
    <p class="text-base">{{ orderGetters.getOrderItemOrderPropertyName(additionalCost) }}:</p>
    <p class="text-right">
      {{
        showNetPrices
          ? format(orderGetters.getOrderItemOrderPropertyNetSurcharge(additionalCost))
          : format(orderGetters.getOrderItemOrderPropertySurcharge(additionalCost))
      }}
    </p>
  </div>
  <UiDivider v-if="additionalCostsWithoutTax.length > 0" class="mt-2 mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.subTotal') }}:</p>
    <p v-if="showNetPrices" class="text-right">{{ format(order.totals.itemSumNet) }}</p>
    <p v-else class="text-right">{{ format(orderGetters.getSubTotal(order.totals)) }}</p>
  </div>
  <div class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.shipping') }}:</p>
    <p v-if="showNetPrices" class="text-right">
      {{ getShippingAmount(orderGetters.getOriginalShippingCostNet(order)) }}
    </p>
    <p v-else class="text-right">{{ getShippingAmount(orderGetters.getOriginalShippingCost(order)) }}</p>
  </div>
  <div v-if="orderGetters.getCouponValue(order.totals) < 0" class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('coupon.name') }}:</p>
    <p class="text-right">{{ format(orderGetters.getCouponValue(order.totals)) }}</p>
  </div>
  <div v-for="(vat, index) in orderGetters.getOriginalOrderVats(order)" :key="index" class="grid grid-cols-2 mt-2">
    <p class="font-medium text-base">{{ t('orderConfirmation.vat') }} ({{ orderGetters.getOrderVatRate(vat) }}%):</p>
    <p class="text-right">
      {{ showNetPrices ? t('orderProperties.vat.excl') : t('orderProperties.vat.incl') }}
      {{ format(orderGetters.getOrderVatValue(vat)) }}
    </p>
  </div>
  <UiDivider v-if="additionalCostsWithTax.length > 0" class="mt-2 mb-2" />
  <div v-for="(additionalCost, index) in additionalCostsWithTax" :key="index" class="grid grid-cols-2">
    <p class="text-base">{{ orderGetters.getOrderItemOrderPropertyName(additionalCost) }}:</p>
    <p class="text-right">
      {{
        showNetPrices
          ? format(orderGetters.getOrderItemOrderPropertyNetSurcharge(additionalCost))
          : format(orderGetters.getOrderItemOrderPropertySurcharge(additionalCost))
      }}
    </p>
  </div>
  <UiDivider class="mt-2 mb-2" />
  <div class="grid grid-cols-2">
    <p class="font-medium text-base" :class="{ 'font-bold text-xl': isOrderTypeOffer }">
      {{ t('orderConfirmation.total') }}:
    </p>
    <p class="text-right" :class="{ 'font-bold text-xl': isOrderTypeOffer }">
      {{
        showNetPrices ? format(orderGetters.getTotalNet(originalTotals)) : format(orderGetters.getTotal(originalTotals))
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { orderGetters, offerGetters } from '@plentymarkets/shop-api';
import type { OrderTotalsPropsType } from './types';

const props = defineProps<OrderTotalsPropsType>();
const { t } = useI18n();
const { formatWithSymbol } = usePriceFormatter();
const originalTotals = orderGetters.getTotals(props.order);
const currency = orderGetters.getCurrency(props.order);
const showNetPrices = originalTotals.isNet;

const format = (value: number) => {
  return formatWithSymbol(value, currency);
};

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shippingMethod.free') : formatWithSymbol(Number(amount), currency);
};

const isOrderTypeOffer = offerGetters.isTypeOffer(props.order);
const additionalCostsWithoutTax = orderGetters.getAdditionalCostsWithTax(props.order);
const additionalCostsWithTax = orderGetters.getAdditionalCostsWithoutTax(props.order);
</script>
