<template>
  <template v-if="newOrderFlow">
    <div v-if="paymentKey === PayPalPaymentKey">
      <PayPalExpressButton
          :disabled="disableBuyButton"
          type="Checkout"
          location="checkoutPage"
          @validation-callback="handlePreparePaymentPayPal"
      />
      <PayPalPayLaterBanner
          placement="payment"
          location="checkoutPage"
          :amount="cartGetters.getTotal(cartGetters.getTotals(cart))"
          :commit="true"
      />
    </div>
    <PayPalCreditCardBuyButton
        v-else-if="paymentKey === PayPalCreditCardPaymentKey"
        :disabled="disableBuyButton || paypalCardDialog"
        @click="openPayPalCardDialog"
    />
    <ApplePayButton
        v-else-if="paymentKey === PayPalApplePayKey"
        :style="disableBuyButton ? 'pointer-events: none;' : ''"
        @button-clicked="handlePreparePaymentPayPal"
    />
    <GooglePayButton
        v-else-if="paymentKey === PayPalGooglePayKey"
        :style="disableBuyButton ? 'pointer-events: none;' : ''"
        @button-clicked="handlePreparePaymentPayPal"
    />
    <PayPalAPM
        v-else-if="PayPalIsAPM"
        :disabled="disableBuyButton"
        :payment-key="paymentKey ?? ''"
        @validation-callback="handlePreparePaymentPayPal"
    />
  </template>
  <template v-else>
    <div v-if="paymentKey === PayPalPaymentKey">
      <PayPalExpressButton
          :disabled="disableBuyButton"
          type="OrderAlreadyExisting"
          location="checkoutPage"
          :plenty-order-id="order.order.id"
          @on-payed="refetchOrder()"
      />
      <PayPalPayLaterBanner
          placement="payment"
          location="checkoutPage"
          :amount="orderGetters.getTotal(orderGetters.getTotals(order))"
          :commit="true"
      />
    </div>
    <PayPalCreditCardBuyButton
        v-else-if="paymentKey === PayPalCreditCardPaymentKey"
        :disabled="disableBuyButton || paypalCardDialog"
        @click="openPayPalCardDialog"
        @on-payed="refetchOrder()"
    />
    <PayPalCreditCardBuyButton
        v-else-if="paymentKey === PayPalPayUponInvoiceKey"
        :disabled="disableBuyButton || paypalCardDialog"
        @click="payPalPayUponInvoice = true"
    />
    <ApplePayButton
        v-else-if="paymentKey === PayPalApplePayKey"
        :style="disableBuyButton ? 'pointer-events: none;' : ''"
        @button-clicked="handlePreparePaymentPayPal"
        @on-payed="refetchOrder()"
    />
    <GooglePayButton
        v-else-if="paymentKey === PayPalGooglePayKey"
        :style="disableBuyButton ? 'pointer-events: none;' : ''"
        :order="order"
        @button-clicked="handlePreparePaymentPayPal"
        @on-payed="refetchOrder()"
    />
    <PayPalAPM
        v-else-if="PayPalIsAPM"
        :disabled="disableBuyButton"
        :payment-key="paymentKey ?? ''"
        :order="order"
        @validation-callback="handlePreparePaymentPayPal"
        @on-payed="refetchOrder()"
    />
  </template>

  <UiModal
      v-if="paymentKey === PayPalPayUponInvoiceKey"
      v-model="payPalPayUponInvoice"
      class="h-full w-full @md:w-[600px] @md:h-fit"
      tag="section"
      disable-click-away
  >
    <PayPalPayUponInvoiceForm :order="order" @confirm-cancel="handlePayUponInvoiceModalClosing" @on-payed="refetchOrder()" />
  </UiModal>
  <UiModal
      v-if="paypalCardDialog"
      v-model="paypalCardDialog"
      class="h-full w-full overflow-auto @md:w-[600px] @md:h-fit"
      tag="section"
      disable-click-away
  >
    <PayPalCreditCardForm :order="order" @confirm-cancel="paypalCardDialog = false" @on-payed="refetchOrder()" />
  </UiModal>
</template>

<script setup lang="ts">
import {cartGetters, orderGetters} from '@plentymarkets/shop-api';
import type { PaymentButtonComponentProps, ReInitializePaymentButtonComponentProps } from '@plentymarkets/shop-core';
import {
  PayPalCreditCardPaymentKey,
  PayPalPaymentKey,
  PayPalGooglePayKey,
  PayPalApplePayKey,
  PayPalPayUponInvoiceKey,
  PayPalAlternativeFundingSourceMapper, type PayPalAddToCartCallback,
} from '#paypal/types';

const { loading: createOrderLoading } = useMakeOrder();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { processingOrder } = useProcessingOrder();
const { send } = useNotification();
const { fetchOrderClient } = useCustomerOrder('soft-login');
const {
  shippingPrivacyAgreement,
  customerWish,
  customerSign,
  doAdditionalInformation,
  loading: additionalInformationLoading,
} = useAdditionalInformation();
const {
  cart,
  cartLoading,
  anyAddressFormIsOpen,
  hasShippingAddress,
  hasBillingAddress,
  backToFormEditing,
  validateTerms,
  scrollToShippingAddress,
} = useCheckout();
const { paymentLoading, shippingLoading } = useCheckoutPagePaymentAndShipping();
const disableShippingPayment = computed(() => shippingLoading.value || paymentLoading.value);
const disableBuyButton = computed(
    () =>
        createOrderLoading.value ||
        disableShippingPayment.value ||
        cartLoading.value ||
        additionalInformationLoading.value ||
        navigationInProgress.value ||
        processingOrder.value,
);
const props = defineProps<ReInitializePaymentButtonComponentProps | PaymentButtonComponentProps>();
const PayPalIsAPM = computed(() => {
  return Object.keys(PayPalAlternativeFundingSourceMapper).includes(props.paymentKey ?? '');
})
const newOrderFlow = computed(() => !('order' in props));
const order = computed(() => (props as ReInitializePaymentButtonComponentProps).order);
const paypalCardDialog = ref(false);
const payPalPayUponInvoice = ref(false);

const handlePayUponInvoiceModalClosing = () => {
  payPalPayUponInvoice.value = false;
  processingOrder.value = false;
  usePayUponInvoice().resetState();
};

const validateAndProceed = async (): Promise<boolean> => {
  if (!newOrderFlow.value) return true;
  if (!readyToBuy()) return false;
  return await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
    orderCustomerSign: customerSign.value,
  });
};

const handlePreparePaymentPayPal = async (callback?: PayPalAddToCartCallback) => {
  const canProceed = await validateAndProceed();
  if (typeof callback === 'function') callback(canProceed);
};

const readyToBuy = () => {
  if (anyAddressFormIsOpen.value) {
    send({ type: 'secondary', message: t('address.unsavedWarning') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value || !hasBillingAddress.value) {
    send({ type: 'secondary', message: t('error.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  return validateTerms();
};

const openPayPalCardDialog = async () => {
  if (!(await validateAndProceed())) return;
  paypalCardDialog.value = true;
};

const refetchOrder = async () => {
  const shippingAddress = orderGetters.getShippingAddress(order.value);
  await fetchOrderClient({
    orderId: orderGetters.getId(order.value),
    accessKey: orderGetters.getAccessKey(order.value),
    postcode: shippingAddress?.postalCode,
    name: shippingAddress?.name3 || shippingAddress?.name1 || undefined,
  });
};
</script>