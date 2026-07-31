<template>
  <template v-if="!order">
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
      @click="handleCreditCardClick"
    />
    <PayPalCreditCardBuyButton
      v-else-if="paymentKey === PayPalPayUponInvoiceKey"
      :disabled="disableBuyButton || paypalCardDialog"
      @click="handleUponInvoiceClick"
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
  <template v-else-if="order">
    <div v-if="paymentKey === PayPalPaymentKey">
      <PayPalExpressButton
        :disabled="disableBuyButton"
        type="OrderAlreadyExisting"
        location="checkoutPage"
        :plenty-order-id="order.order.id"
        @on-payed="refetchOrderEvent()"
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
    >
      {{ t('common.actions.pay') }}
    </PayPalCreditCardBuyButton>
    <PayPalCreditCardBuyButton
      v-else-if="paymentKey === PayPalPayUponInvoiceKey"
      :disabled="disableBuyButton || paypalCardDialog"
      @click="() => (payPalPayUponInvoice = true)"
    >
      {{ t('common.actions.pay') }}
    </PayPalCreditCardBuyButton>
    <ApplePayButton
      v-else-if="paymentKey === PayPalApplePayKey"
      :style="disableBuyButton ? 'pointer-events: none;' : ''"
      :order="order"
      @button-clicked="handlePreparePaymentPayPal"
      @on-payed="refetchOrderEvent()"
    />
    <GooglePayButton
      v-else-if="paymentKey === PayPalGooglePayKey"
      :style="disableBuyButton ? 'pointer-events: none;' : ''"
      :order="order"
      @button-clicked="handlePreparePaymentPayPal"
      @on-payed="refetchOrderEvent()"
    />
    <PayPalAPM
      v-else-if="PayPalIsAPM"
      :disabled="disableBuyButton"
      :payment-key="paymentKey ?? ''"
      :order="order"
      @validation-callback="handlePreparePaymentPayPal"
      @on-payed="refetchOrderEvent()"
    />
    <div v-else class="mt-5 flex items-center gap-2 text-sm text-neutral-600">
      <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
      <span>{{ t('paypalPayment.methodNotSupported') }}</span>
    </div>
  </template>

  <Teleport to="#app-container">
    <UiModal
      v-if="paymentKey === PayPalPayUponInvoiceKey"
      v-model="payPalPayUponInvoice"
      class="h-full w-full @md:w-[600px] @md:h-fit"
      tag="section"
      disable-click-away
    >
      <PayPalPayUponInvoiceForm
        :order="order"
        @confirm-cancel="handlePayUponInvoiceModalClosing"
        @on-payed="refetchOrderEvent()"
      />
    </UiModal>
    <UiModal
      v-if="paypalCardDialog"
      v-model="paypalCardDialog"
      class="h-full w-full overflow-auto @md:w-[600px] @md:h-fit"
      tag="section"
      disable-click-away
    >
      <PayPalCreditCardForm :order="order" @confirm-cancel="paypalCardDialog = false" @on-payed="refetchOrderEvent()" />
    </UiModal>
  </Teleport>
</template>

<script setup lang="ts">
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';
import type { Order } from '@plentymarkets/shop-api';
import {
  PayPalCreditCardPaymentKey,
  PayPalPaymentKey,
  PayPalGooglePayKey,
  PayPalApplePayKey,
  PayPalPayUponInvoiceKey,
  PayPalAlternativeFundingSourceMapper,
  type PayPalAddToCartCallback,
} from '#paypal/types';
import { SfIconWarning } from '@storefront-ui/vue';

const { loading: createOrderLoading } = useMakeOrder();
defineEmits<{ click: [event: MouseEvent] }>();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
const { send } = useNotification();
const { refetchOrder } = useCustomerOrder('soft-login');
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
const props = defineProps<{
  disabled: boolean;
  paymentKey?: string;
  order?: Order;
}>();
const PayPalIsAPM = computed(() => {
  return Object.keys(PayPalAlternativeFundingSourceMapper).includes(props.paymentKey ?? '');
});
const paypalCardDialog = ref(false);
const payPalPayUponInvoice = ref(false);

const handlePayUponInvoiceModalClosing = () => {
  payPalPayUponInvoice.value = false;
  processingOrder.value = false;
  usePayUponInvoice().resetState();
};

const validateAndProceed = async (): Promise<boolean> => {
  if (!readyToBuy()) return false;
  return await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
    orderCustomerSign: customerSign.value,
  });
};

const handlePreparePaymentPayPal = async (callback?: PayPalAddToCartCallback) => {
  if (props.order) {
    if (typeof callback === 'function') callback(true);
    return;
  }
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

const handleCreditCardClick = async () => {
  const canProceed = await validateAndProceed();
  if (canProceed) openPayPalCardDialog();
};

const openPayPalCardDialog = () => {
  paypalCardDialog.value = true;
};

const handleUponInvoiceClick = async () => {
  const canProceed = await validateAndProceed();
  if (canProceed) payPalPayUponInvoice.value = true;
};

const refetchOrderEvent = async () => {
  await refetchOrder();
  processingOrder.value = false;
};
</script>
