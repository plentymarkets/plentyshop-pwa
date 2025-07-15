<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="cart" class="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div class="col-span-6 xl:col-span-7 mb-10 lg:mb-0">
        <UiDivider id="top-contact-information-divider" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation id="contact-information" />
        <UiDivider id="top-shipping-divider" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer id="shipping-address" :key="0" :type="AddressType.Shipping" />
        <UiDivider id="top-billing-divider" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer id="billing-address" :key="1" :type="AddressType.Billing" />
        <UiDivider id="bottom-billing-divider" class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative" :class="{ 'pointer-events-none opacity-50': disableShippingPayment }">
          <ShippingMethod :disabled="disableShippingPayment" @update:shipping-method="handleShippingMethodUpdate" />
          <SfLoaderCircular
            v-if="disableShippingPayment"
            class="absolute mt-5 right-0 left-0 m-auto z-[999]"
            size="2xl"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <PreferredDeliveryPackstationFinder v-if="countryHasDelivery" />
          <PreferredDelivery v-if="countryHasDelivery" />
          <UiDivider v-if="preferredDeliveryAvailable" class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment :disabled="disableShippingPayment" @update:active-payment="handlePaymentMethodUpdate" />
        </div>
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CustomerWish />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
        <CheckoutGeneralTerms />
      </div>
      <div class="col-span-6 xl:col-span-5">
        <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
          <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
        </div>
        <div class="relative md:sticky md:top-20 h-fit" :class="{ 'pointer-events-none opacity-50': cartLoading }">
          <SfLoaderCircular v-if="cartLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <Coupon />
          <OrderSummary v-if="cart" :cart="cart" class="mt-4">
            <CheckoutExportDeliveryHint v-if="cart.isExportDelivery" />
            <PaymentButtons />
            <ModuleComponentRendering area="checkout.afterBuyButton" />
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import { AddressType, cartGetters } from '@plentymarkets/shop-api';

definePageMeta({
  layout: 'simplified-header-and-footer',
  pageType: 'static',
  middleware: ['reject-empty-checkout'],
});

const { send } = useNotification();
const { t } = useI18n();
const localePath = useLocalePath();
const { emit } = usePlentyEvent();
const { countryHasDelivery } = useCheckoutAddress(AddressType.Shipping);
const {
  cart,
  cartIsEmpty,
  cartLoading,
  persistShippingAddress,
  persistBillingAddress,
  setBillingSkeleton,
  setShippingSkeleton,
} = useCheckout();
const { preferredDeliveryAvailable } = usePreferredDelivery();
const { fetchPaymentMethods } = usePaymentMethods();
const { paymentLoading, shippingLoading, handleShippingMethodUpdate, handlePaymentMethodUpdate } =
  useCheckoutPagePaymentAndShipping();

emit('frontend:beginCheckout', cart.value);

const checkPayPalPaymentsEligible = async () => {
  if (import.meta.client) {
    const { data: cart } = useCart();
    const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));

    await Promise.all([
      useGooglePay().checkIsEligible(),
      useApplePay().checkIsEligible(),
      usePayPal().updateAvailableAPMs(currency.value, true),
    ]);
    await fetchPaymentMethods();
  }
};
await callOnce(async () => {
  await Promise.all([fetchPaymentMethods(), useAggregatedCountries().fetchAggregatedCountries()]);
});

onNuxtReady(async () => {
  await useFetchAddress(AddressType.Shipping)
    .fetchServer()
    .then(() => persistShippingAddress())
    .then(() => setShippingSkeleton(false))
    .catch((error) => useHandleError(error));

  await useFetchAddress(AddressType.Billing)
    .fetchServer()
    .then(() => persistBillingAddress())
    .then(() => setBillingSkeleton(false))
    .catch((error) => useHandleError(error));

  useCartShippingMethods().getShippingMethods();
  checkPayPalPaymentsEligible();
});

const disableShippingPayment = computed(() => shippingLoading.value || paymentLoading.value);
const itemSumNet = computed(() => cartGetters.getItemSumNet(cart.value));
const { processingOrder } = useProcessingOrder();

watch(cartIsEmpty, async () => {
  if (!processingOrder.value) {
    send({ type: 'neutral', message: t('emptyCartNotification') });
    await navigateTo(localePath(paths.cart));
  }
});

watch(itemSumNet, async () => {
  await fetchPaymentMethods();
});
</script>
