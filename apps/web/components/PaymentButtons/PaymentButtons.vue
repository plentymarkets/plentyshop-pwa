<template>
  <component
    :is="component.componentName"
    v-for="(component, index) in filteredComponents"
    :key="index"
    :disabled="disableBuyButton"
    @click="validateOnClickComponents($event, component)"
  />
  <div v-if="filteredComponents.length === 0">
    <div v-if="selectedPaymentId === paypalPaymentId">
      <PayPalExpressButton :disabled="disableBuyButton" type="Checkout" @validation-callback="handlePreparePayment" />
      <PayPalPayLaterBanner
        placement="payment"
        :amount="cartGetters.getTotal(cartGetters.getTotals(cart))"
        :commit="true"
      />
    </div>
    <PayPalCreditCardBuyButton
      v-else-if="selectedPaymentId === paypalCreditCardPaymentId"
      :disabled="disableBuyButton || paypalCardDialog"
      @click="openPayPalCardDialog"
    />
    <PayPalApplePayButton
      v-else-if="selectedPaymentId === paypalApplePayPaymentId"
      :style="disableBuyButton ? 'pointer-events: none;' : ''"
      @button-clicked="handlePreparePayment"
    />
    <PayPalGooglePayButton
      v-else-if="selectedPaymentId === paypalGooglePayPaymentId"
      :style="disableBuyButton ? 'pointer-events: none;' : ''"
      @button-clicked="handlePreparePayment"
    />
    <PayPalAPM v-else-if="PayPalIsAPM" :disabled="disableBuyButton" @validation-callback="handlePreparePayment" />

    <UiButton
      v-else
      type="submit"
      :disabled="disableBuyButton"
      size="lg"
      data-testid="place-order-button"
      class="w-full mb-4 md:mb-0 cursor-pointer"
      @click="handlePreparePayment"
    >
      <template v-if="createOrderLoading || additionalInformationLoading">
        <SfLoaderCircular class="flex justify-center items-center" size="sm" />
      </template>
      <template v-else>{{ t('buy') }}</template>
    </UiButton>
  </div>

  <UiModal
    v-if="payPalPayUponInvoice"
    v-model="payPalPayUponInvoice"
    class="h-full w-full md:w-[600px] md:h-fit"
    tag="section"
    disable-click-away
  >
    <PayPalPayUponInvoiceForm @confirm-cancel="handlePayUponInvoiceModalClosing" />
  </UiModal>

  <UiModal
    v-if="paypalCardDialog"
    v-model="paypalCardDialog"
    class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
    tag="section"
    disable-click-away
  >
    <PayPalCreditCardForm @confirm-cancel="paypalCardDialog = false" />
  </UiModal>
</template>

<script setup lang="ts">
import { cartGetters, paymentProviderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import {
  PayPalCreditCardPaymentKey,
  PayPalPaymentKey,
  PayPalGooglePayKey,
  PayPalApplePayKey,
} from '~/composables/usePayPal/types';
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';
import { keyBy } from '~/utils/keyBy';
import type { PaymentButtonComponent } from '@plentymarkets/shop-core';

const { t } = useI18n();
const { components } = useDynamicPaymentButtons();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { processingOrder } = useProcessingOrder();
const localePath = useLocalePath();
const { emit } = usePlentyEvent();
const { send } = useNotification();
const {
  shippingPrivacyAgreement,
  customerWish,
  doAdditionalInformation,
  loading: additionalInformationLoading,
} = useAdditionalInformation();
const paypalCardDialog = ref(false);
const payPalPayUponInvoice = ref(false);

const {
  cart,
  clearCartItems,
  cartLoading,
  anyAddressFormIsOpen,
  hasShippingAddress,
  hasBillingAddress,
  backToFormEditing,
  validateTerms,
  scrollToShippingAddress,
} = useCheckout();

const { paymentLoading, shippingLoading, paymentMethods, selectedPaymentId } = useCheckoutPagePaymentAndShipping();
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

const paypalPaymentId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalPaymentKey);
});

const paypalCreditCardPaymentId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalCreditCardPaymentKey);
});

const paypalGooglePayPaymentId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalGooglePayKey);
});

const paypalApplePayPaymentId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalApplePayKey);
});

const PayPalPayUponInvoiceId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalPayUponInvoiceKey);
});

const PayPalIsAPM = computed(() => {
  if (!paymentMethods.value.list) return false;
  const selectedPayment = paymentProviderGetters.getPaymentMethodById(
    paymentMethods.value.list,
    selectedPaymentId.value,
  );
  return (
    selectedPayment &&
    Object.keys(PayPalAlternativeFundingSourceMapper).includes(paymentProviderGetters.getPaymentKey(selectedPayment))
  );
});

const handlePayUponInvoiceModalClosing = () => {
  payPalPayUponInvoice.value = false;
  processingOrder.value = false;
  usePayUponInvoice().resetState();
};

const handlePreparePayment = async (callback?: PayPalAddToCartCallback) => {
  if (!readyToBuy()) {
    if (typeof callback === 'function' && callback) callback(false);
    return;
  }

  await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
  });

  typeof callback === 'function' && callback ? callback(true) : await order();
};

const order = async () => {
  const paymentMethodsById = keyBy(paymentMethods.value.list, 'id');

  if (paymentMethodsById[selectedPaymentId.value].key === 'plentyPayPal') {
    selectedPaymentId.value === PayPalPayUponInvoiceId.value
      ? (payPalPayUponInvoice.value = true)
      : (paypalCardDialog.value = true);

    return;
  }

  processingOrder.value = true;
  await handleRegularOrder();
};

const readyToBuy = () => {
  if (anyAddressFormIsOpen.value) {
    send({ type: 'secondary', message: t('unsavedAddress') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value || !hasBillingAddress.value) {
    send({ type: 'secondary', message: t('errorMessages.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  return validateTerms();
};

const openPayPalCardDialog = async () => {
  if (!readyToBuy()) return;
  await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
  });

  paypalCardDialog.value = true;
};

const handleRegularOrder = async () => {
  const data = await createOrder({
    paymentId: paymentMethods.value.selected,
  });

  if (data?.order?.id) {
    emit('frontend:orderCreated', data);
    clearCartItems();
    navigateTo(localePath(paths.confirmation + '/' + data.order.id + '/' + data.order.accessKey));
  } else {
    await useCartStockReservation().unreserve();
    processingOrder.value = false;
  }
};

const renderPaymentComponent = (component: PaymentButtonComponent) => {
  const selectedPayment = paymentMethods.value.list.find((payment) => payment.id === selectedPaymentId.value);

  if (!selectedPayment) {
    return false;
  }
  if (component.key && selectedPayment?.key !== component.key) {
    return false;
  }
  if (component.paymentKey && selectedPayment?.paymentKey !== component.paymentKey) {
    return false;
  }
  if (component.excludeKeys && component.excludeKeys.includes(selectedPayment?.key)) {
    return false;
  }
  return !(component.excludePaymentKeys && component.excludePaymentKeys.includes(selectedPayment?.paymentKey));
};
const filteredComponents = computed(() => components.value.filter((component) => renderPaymentComponent(component)));
const validateOnClickComponents = async (event: MouseEvent, component: PaymentButtonComponent) => {
  if (component.disableClickEvent) {
    return;
  }
  await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
  });
  if (readyToBuy() && event.target) {
    event.target.dispatchEvent(new CustomEvent('validated-click'));
  }
};
</script>
