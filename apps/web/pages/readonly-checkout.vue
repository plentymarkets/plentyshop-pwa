<template>
  <NuxtLayout
    name="checkout"
    page-type="static"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="cart" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider :class="dividerClass" />
        <ContactInformation disabled />
        <UiDivider :class="dividerClass" />
        <AddressContainer id="shipping-address" :key="0" :disabled="false" :type="AddressType.Shipping" />
        <UiDivider :class="dividerClass" />
        <AddressContainer id="billing-address" :key="1" :disabled="true" :type="AddressType.Billing" />
        <UiDivider :class="dividerClass" />
        <div class="relative">
          <ShippingMethod disabled />
          <UiDivider :class="dividerClass" />
          <CheckoutPayment disabled />
        </div>
        <UiDivider :class="dividerClass" />
        <CustomerWish />
        <UiDivider :class="`${dividerClass} mb-10`" />
        <div class="text-sm mx-4 md:pb-0">
          <CheckoutGeneralTerms />
        </div>
      </div>
      <div class="col-span-5">
        <div v-for="cartItem in cart?.items" :key="cartItem.id">
          <UiCartProductCard disabled :cart-item="cartItem" />
        </div>
        <div class="relative md:sticky mt-4 md:top-20 h-fit" :class="{ 'pointer-events-none opacity-50': cartLoading }">
          <SfLoaderCircular v-if="cartLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <OrderSummary v-if="cart" :cart="cart">
            <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
            <div v-if="payPalAvailable">
              <PayPalExpressButton
                v-if="changedTotal"
                :disabled="!termsAccepted || interactionDisabled"
                type="Checkout"
                @validation-callback="payPalValidateCallback"
              />

              <UiButton
                v-else
                type="submit"
                :disabled="interactionDisabled"
                size="lg"
                class="w-full mb-4 md:mb-0 cursor-pointer"
                @click="buy"
              >
                <SfLoaderCircular v-if="interactionDisabled" class="flex justify-center items-center" size="sm" />
                <template v-else>{{ t('buy') }}</template>
              </UiButton>
            </div>
            <div
              v-else
              class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md mb-4"
            >
              <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
              <div class="py-2 mr-2">
                PayPal is not available for this order. Please change your address or payment method to continue.
              </div>
            </div>
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType } from '@plentymarkets/shop-api';
import { SfLoaderCircular, SfIconWarning } from '@storefront-ui/vue';
import PayPalExpressButton from '~/components/PayPal/PayPalExpressButton.vue';
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';

const ID_CHECKBOX = '#terms-checkbox';
const localePath = useLocalePath();
const route = useRoute();
const { send } = useNotification();
const { t } = useI18n();
const { loginAsGuest, data: customer, getSession } = useCustomer();
const { isLoading: navigationInProgress } = useLoadingIndicator();
const { data: cart, cartIsEmpty, getCart, loading: cartLoading } = useCart();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { emit } = usePlentyEvent();
const {
  loading: executeOrderLoading,
  createPlentyOrder,
  captureOrder,
  createPlentyPaymentFromPayPalOrder,
  setAddressesFromPayPal,
} = usePayPal();
const { processingOrder } = useProcessingOrder();
const { setInitialCartTotal, changedTotal } = useCartTotalChange();
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const { loadPayment, loadShipping } = useCheckoutPagePaymentAndShipping();
const { checkoutAddress: billingAddress, set: setBillingAddress } = useCheckoutAddress(AddressType.Billing);
const { checkoutAddress: shippingAddress, set: setShippingAddress } = useCheckoutAddress(AddressType.Shipping);
const {
  shippingPrivacyAgreement,
  customerWish,
  doAdditionalInformation,
  loading: additionalInformationLoading,
} = useAdditionalInformation();
const {
  anyAddressFormIsOpen,
  hasShippingAddress,
  persistShippingAddress,
  persistBillingAddress,
  backToFormEditing,
  scrollToShippingAddress,
  setBillingSkeleton,
  setShippingSkeleton,
} = useCheckout();

const paypalOrderId = route?.query?.orderId?.toString() || '';
const dividerClass = 'w-screen md:w-auto -mx-4 md:mx-0';
const disableShippingPayment = computed(() => loadShipping.value || loadPayment.value);
const interactionDisabled = computed(
  () =>
    disableShippingPayment.value ||
    additionalInformationLoading.value ||
    cartLoading.value ||
    navigationInProgress.value ||
    processingOrder.value ||
    executeOrderLoading.value,
);

const payPalAvailable = computed(() =>
  paymentMethodData?.value?.list?.find((method) => method.paymentKey === 'PAYPAL' && method.key === 'plentyPayPal'),
);

const handle = async () => {
  if (!paypalOrderId) return navigateTo(localePath(paths.cart));

  await setAddressesFromPayPal(paypalOrderId);
  await getCart();

  await useFetchAddress(AddressType.Shipping)
    .fetch()
    .then(() => persistShippingAddress())
    .then(() => setShippingSkeleton(false))
    .catch((error) => useHandleError(error));

  await useFetchAddress(AddressType.Billing)
    .fetch()
    .then(() => persistBillingAddress())
    .then(() => setBillingSkeleton(false))
    .catch((error) => useHandleError(error));

  if (customer.value.user === null && (billingAddress.value?.email || shippingAddress.value?.email)) {
    await loginAsGuest(billingAddress.value?.email || shippingAddress.value?.email || '');
    await getSession();

    if (!billingAddress.value) {
      await setBillingAddress(shippingAddress.value);
    } else if (!shippingAddress.value) {
      await setShippingAddress(billingAddress.value);
    }
  }

  if (customer.value.user === null) {
    return navigateTo(localePath('/checkout'));
  }

  await Promise.all([
    useCartShippingMethods().getShippingMethods(),
    fetchPaymentMethods(),
    useAggregatedCountries().fetchAggregatedCountries(),
  ]);

  await setInitialCartTotal();
};

const scrollToTerms = () => {
  scrollToHTMLObject(ID_CHECKBOX);
  setShowErrors(true);
};

const validateFields = async () => {
  if (interactionDisabled.value) return false;

  if (cartIsEmpty.value) {
    send({ type: 'neutral', message: t('emptyCartNotification') });
    await navigateTo(localePath(paths.cart));
    return false;
  }

  if (anyAddressFormIsOpen.value) {
    send({ type: 'secondary', message: t('unsavedAddress') });
    return backToFormEditing();
  }

  if (!hasShippingAddress.value) {
    send({ type: 'secondary', message: t('errorMessages.checkout.missingAddress') });
    scrollToShippingAddress();
    return false;
  }

  if (!termsAccepted.value) {
    scrollToTerms();
    return false;
  }

  await doAdditionalInformation({
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    orderContactWish: customerWish.value,
  });

  return true;
};

const payPalValidateCallback = async (callback?: PayPalAddToCartCallback) => {
  if (callback) callback(await validateFields());
};

const buy = async () => {
  if (await validateFields()) {
    const order = await createPlentyOrder();

    if (order) {
      await captureOrder(paypalOrderId);
      await createPlentyPaymentFromPayPalOrder(paypalOrderId, order.order.id);

      useProcessingOrder().processingOrder.value = true;
      emit('module:clearCart', null);

      if (order?.order?.id) {
        emit('frontend:orderCreated', order);
        navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
      }
    } else {
      send({ type: 'negative', message: 'Fehler beim Erstellen der Order bre.' });
      navigateTo(localePath(paths.cart));
    }
  }
};

watch(payPalAvailable, async (newValue) => {
  if (newValue) {
    if (cart.value.methodOfPaymentId !== newValue.id) {
      await savePaymentMethod(newValue.id);
    }
  }
});

onMounted(() => {
  handle();
});
</script>
