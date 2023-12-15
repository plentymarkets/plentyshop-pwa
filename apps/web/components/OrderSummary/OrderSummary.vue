<template>
  <div class="shadow-lg md:rounded-md md:border md:border-neutral-100" data-testid="order-summary">
    <div class="flex justify-between items-end py-2 px-4 md:px-6 md:pt-6 md:pb-4">
      <p class="typography-headline-4 font-bold md:typography-headline-3">{{ t('orderSummary') }}</p>
      <p class="typography-text-base font-medium" data-testid="total-in-cart">
        {{ t('itemsInCart', cartItemsCount) }}
      </p>
    </div>
    <div class="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
      <div class="flex justify-between typography-text-base pb-4">
        <div class="flex flex-col gap-2 grow pr-2">
          <p data-testid="subtotal-label">{{ t('itemsSubtotal') }}</p>
          <p data-testid="shipping-label">{{ t('delivery') }}</p>
          <p v-if="cartGetters.getCouponDiscount(props.cart)" data-testid="coupon-label">{{ t('coupon.name') }}</p>
          <p data-testid="vat-label">{{ t('estimatedTax') }}</p>
        </div>
        <div class="flex flex-col gap-2 text-right">
          <p data-testid="subtotal" class="font-medium">{{ n(totals.subTotal, 'currency') }}</p>
          <p data-testid="shipping" class="font-medium">
            {{ getShippingAmount(cartGetters.getShippingPrice(props.cart)) }}
          </p>
          <p v-if="cartGetters.getCouponDiscount(props.cart)" class="font-medium" data-testid="coupon-value">
            {{ n(cartGetters.getCouponDiscount(props.cart), 'currency') }}
          </p>
          <p data-testid="vat">{{ n(totals.vatAmmount, 'currency') }}</p>
        </div>
      </div>
      <div class="flex justify-between typography-headline-4 md:typography-headline-3 font-bold pb-4 mb-4">
        <p data-testid="total-label">{{ t('total') }}</p>
        <p data-testid="total">{{ n(totals.total, 'currency') }}</p>
      </div>
      <UiDivider class="my-4 w-auto" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-sdk';
import type { OrderSummaryPropsType } from '~/components/OrderSummary/types';

const props = defineProps<OrderSummaryPropsType>();
const { t, n } = useI18n();

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(props.cart);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vatAmmount: Number(totalsData.vatAmount),
  };
});

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shippingMethod.free') : n(Number(amount), 'currency');
};

const cartItemsCount = computed(() => props.cart?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
</script>
