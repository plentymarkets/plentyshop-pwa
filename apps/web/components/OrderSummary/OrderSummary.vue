<template>
  <div class="shadow-lg md:rounded-md md:border md:border-neutral-100" data-testid="order-summary">
    <div class="flex justify-between items-end py-2 px-4 md:px-6 md:pt-6 md:pb-4">
      <h2 class="typography-headline-4 font-bold md:typography-headline-3">{{ t('orderSummary') }}</h2>
      <p class="typography-text-base font-medium" data-testid="total-in-cart">
        {{ t('itemsInCart', cartItemsCount) }}
      </p>
    </div>

    <div class="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
      <div v-if="orderPropertiesWithVatAdditionalCosts.length > 0" class="mb-4">
        <div
          v-for="property in orderPropertiesWithVatAdditionalCosts"
          :key="cartGetters.getBasketItemOrderParamPropertyId(property)"
          class="flex justify-between typography-text-base w-full"
        >
          <p class="flex flex-col gap-2 grow pr-2">{{ cartGetters.getBasketItemOrderParamName(property) }}</p>
          <p class="flex flex-col gap-2 text-right">
            {{ format(cartGetters.getBasketItemOrderParamPrice(property)) }}
          </p>
        </div>

        <UiDivider class="mt-4 w-auto" />
      </div>

      <div class="flex justify-between typography-text-base mb-4">
        <div class="flex flex-col gap-1 grow pr-2">
          <p data-testid="subtotal-label">
            {{ t('itemsSubtotal') }} <span v-if="showNetPrices">({{ t('netPrice') }})</span>
          </p>
          <p data-testid="shipping-label">
            {{ t('delivery') }} <span v-if="showNetPrices">({{ t('netPrice') }})</span>
          </p>
          <p v-if="cartGetters.getCouponDiscount(props.cart)" data-testid="coupon-label">{{ t('coupon.name') }}</p>
          <p v-for="(vat, index) in totals.vats" :key="index" data-testid="vat-label">
            {{ showNetPrices ? t('excludedTax') : t('includedTax') }} ({{ cartGetters.getTotalVatValue(vat) }}%)
          </p>
        </div>
        <div v-if="showNetPrices" class="flex flex-col gap-1 text-right">
          <p data-testid="subtotal" class="font-medium">{{ format(cartGetters.getItemSumNet(props.cart)) }}</p>
          <p data-testid="shipping" class="font-medium">
            {{ getShippingAmount(cartGetters.getShippingAmountNet(props.cart)) }}
          </p>
          <p v-if="cartGetters.getCouponDiscount(props.cart)" class="font-medium" data-testid="coupon-value">
            {{ format(cartGetters.getCouponDiscount(props.cart)) }}
          </p>
          <p v-for="(vat, index) in totals.vats" :key="index" data-testid="vat">
            {{ format(cartGetters.getTotalVatAmount(vat)) }}
          </p>
        </div>
        <div v-else class="flex flex-col gap-1 text-right">
          <p data-testid="subtotal" class="font-medium">{{ format(totals.subTotal) }}</p>
          <p data-testid="shipping" class="font-medium">
            {{ getShippingAmount(cartGetters.getShippingPrice(props.cart)) }}
          </p>
          <p v-if="cartGetters.getCouponDiscount(props.cart)" class="font-medium" data-testid="coupon-value">
            {{ format(cartGetters.getCouponDiscount(props.cart)) }}
          </p>
          <p v-for="(vat, index) in totals.vats" :key="index" data-testid="vat">
            {{ format(cartGetters.getTotalVatAmount(vat)) }}
          </p>
        </div>
      </div>

      <div v-if="orderPropertiesWithoutVat.length > 0" class="mb-4">
        <UiDivider class="mb-4" />
        <div
          v-for="property in orderPropertiesWithoutVat"
          :key="cartGetters.getBasketItemOrderParamPropertyId(property)"
          class="flex justify-between typography-text-base w-full"
        >
          <p class="flex flex-col gap-2 grow pr-2">{{ cartGetters.getBasketItemOrderParamName(property) }}</p>
          <p class="flex flex-col gap-2 text-right">
            {{ format(cartGetters.getBasketItemOrderParamPrice(property)) }}
          </p>
        </div>
        <UiDivider class="mt-4 w-auto" />
      </div>

      <div v-if="showNetPrices" class="flex justify-between typography-text-base mb-1">
        <h2 data-testid="total-net-label">{{ t('total') }} ({{ t('netPrice') }})</h2>
        <h2 data-testid="total-net">{{ format(cartGetters.getBasketAmountNet(cart)) }}</h2>
      </div>
      <div class="flex justify-between typography-text-base font-bold pb-4 mb-4">
        <h2 data-testid="total-label">
          {{ t('total') }} <span v-if="showNetPrices">({{ t('grossPrice') }})</span>
        </h2>
        <h2 data-testid="total">{{ format(totals.total) }}</h2>
      </div>
      <UiDivider class="w-auto mb-4" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import type { OrderSummaryPropsType } from '~/components/OrderSummary/types';

const props = defineProps<OrderSummaryPropsType>();
const { t } = useI18n();
const { showNetPrices } = useCart();
const { format } = usePriceFormatter();

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(props.cart);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shippingMethod.free') : format(Number(amount));
};

const cartItemsCount = computed(() => props.cart?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const orderPropertiesWithoutVat = computed(() => cartGetters.getOrderPropertiesWithoutVat(props.cart));
const orderPropertiesWithVatAdditionalCosts = computed(() =>
  cartGetters.getOrderPropertiesAdditionalCostsWithVat(props.cart),
);
</script>
