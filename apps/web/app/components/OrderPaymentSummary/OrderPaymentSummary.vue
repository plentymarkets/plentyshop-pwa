<template>
  <div class="font-bold text-primary-500 @md:text-lg mb-3 mt-10">
    {{ t('account.ordersAndReturns.paymentSummary.heading') }}
  </div>

  <h2 class="font-medium text-base">{{ t('billing.heading') }}</h2>
  <p v-if="sameAsShippingAddress">{{ t('orderConfirmation.sameAsShippingAddress') }}</p>
  <OrderAddressData v-if="billingAddress && !sameAsShippingAddress" :address="billingAddress" />

  <h2 class="font-medium text-base mt-4">{{ t('checkout.payment.heading') }}</h2>
  <div class="flex flex-wrap gap-2 items-center">
    <p>{{ orderGetters.getPaymentMethodName(order) }}</p>
    <template v-if="order.allowPaymentMethodSwitchFrom && enableOrderChangePaymentMethod">
      <UiButton size="sm" variant="secondary" @click="changePaymentMethodModalOpen = true">
        {{ t('account.ordersAndReturns.paymentSummary.changePaymentMethod') }}
      </UiButton>
    </template>
  </div>

  <h2 class="font-medium text-base mt-4">{{ t('account.ordersAndReturns.paymentSummary.paymentStatus') }}</h2>
  <p data-testid="order-payment-status">{{ t(orderGetters.getPaymentStatusKey(order)) }}</p>

  <ClientOnly>
    <div v-if="showPaymentButton" class="mt-4">
      <ReInitializeOrderPaymentButtons :order="order" />
    </div>
    <OrderPaymentMethodModal :order="order" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { orderConfirmationGetters, orderGetters, cartGetters } from '@plentymarkets/shop-api';
import type { OrderPaymentSummaryPropsType } from './types';

const props = defineProps<OrderPaymentSummaryPropsType>();
const { changePaymentMethodModalOpen, refetchOrder } = useCustomerOrder('soft-login');
const shippingAddress = orderGetters.getShippingAddress(props.order);
const billingAddress = orderGetters.getBillingAddress(props.order);
const { getSetting } = useSiteSettings('enableOrderChangePaymentMethod');
const isUnpaid = computed(() => !orderConfirmationGetters.isOrderPaid(props.order));
const validOrderPaymentStatus = computed(() => orderConfirmationGetters.orderStatusValidForPayment(props.order));
const showPaymentButton = computed(
  () => isUnpaid.value && validOrderPaymentStatus.value && props.order.allowPaymentMethodSwitchFrom,
);
const sameAsShippingAddress = shippingAddress && billingAddress && shippingAddress.id === billingAddress.id;
const enableOrderChangePaymentMethod = computed(() => getSetting().toString() === 'true');

const { data: cart } = useCart();
const { updateAvailableAPMs, getScript } = usePayPal();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));

onMounted(async () => {
  if (isUnpaid.value) {
    const payPalScript = await getScript(currency.value, true);
    if (payPalScript) {
      if (await updateAvailableAPMs(payPalScript, currency.value)) await refetchOrder();
    }
  }
});
</script>
