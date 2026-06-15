<template>
  <component
    :is="component.componentName"
    v-for="(component, index) in filteredComponents"
    :key="index"
    :payment-key="paymentKey"
    :disabled="disableBuyButton"
    @click="validateOnClickComponents($event, component)"
  />
  <UiButton
    v-if="filteredComponents.length === 0"
    type="submit"
    :disabled="disableBuyButton"
    size="lg"
    data-testid="place-order-button"
    class="w-full mb-4 @md:mb-0 cursor-pointer"
    @click="handlePreparePayment"
  >
    <template v-if="createOrderLoading || additionalInformationLoading">
      <SfLoaderCircular class="flex justify-center items-center" size="sm" />
    </template>
    <template v-else>{{ t('common.actions.buy') }}</template>
  </UiButton>
</template>

<script setup lang="ts">
import { paymentProviderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { PaymentButtonComponent } from '@plentymarkets/shop-core';

const { components } = useDynamicPaymentButtons();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const localePath = useLocalePath();
const { resolvePathTrailingSlash } = useUrlTrailingSlash();
const { emit } = usePlentyEvent();
const { send } = useNotification();
const {
  shippingPrivacyAgreement,
  customerWish,
  customerSign,
  doAdditionalInformation,
  loading: additionalInformationLoading,
} = useAdditionalInformation();

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

const paymentKey = computed(() => {
  const paymentId = paymentProviderGetters.getMethodOfPaymentId(cart.value);
  const paymentMethod = paymentProviderGetters.getPaymentMethodById(paymentMethods.value.list, Number(paymentId));
  return paymentMethod ? paymentProviderGetters.getPaymentKey(paymentMethod) : null;
});

const validateAndProceed = async (): Promise<boolean> => {
  if (!readyToBuy()) return false;
  return await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
    orderCustomerSign: customerSign.value,
  });
};

const handlePreparePayment = async () => {
  const canProceed = await validateAndProceed();
  if (canProceed) await order();
};

const order = async () => {
  processingOrder.value = true;
  await handleRegularOrder();
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

const handleRegularOrder = async () => {
  const data = await createOrder({
    paymentId: paymentMethods.value.selected,
  });

  if (data?.order?.id) {
    emit('frontend:orderCreated', data);
    clearCartItems();
    return navigateTo(
      resolvePathTrailingSlash(localePath(paths.confirmation + '/' + data.order.id + '/' + data.order.accessKey)),
    );
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
  if (event.target && (await validateAndProceed())) {
    event.target.dispatchEvent(new CustomEvent('validated-click'));
  }
};
</script>
