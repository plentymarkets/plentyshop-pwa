<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="$t('backToCart')"
    :back-label-mobile="$t('back')"
    :heading="$t('checkout')"
  >
    <div v-if="cart" class="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div class="col-span-6 xl:col-span-7 mb-10 lg:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" id="top-shipping-divider" />
        <AddressContainer :type="AddressType.Shipping" :key="0" id="shipping-address" />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" id="top-billing-divider" />
        <AddressContainer :type="AddressType.Billing" :key="1" id="billing-address" />
        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" id="bottom-billing-divider" />
        <div class="relative" :class="{ 'pointer-events-none opacity-50': disableShippingPayment }">
          <ShippingMethod
            :shipping-methods="shippingMethods"
            :disabled="disableShippingPayment"
            @update:shipping-method="handleShippingMethodUpdate"
          />
          <SfLoaderCircular
            v-if="disableShippingPayment"
            class="absolute mt-5 right-0 left-0 m-auto z-[999]"
            size="2xl"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment
            :payment-methods="paymentMethods"
            :disabled="disableShippingPayment"
            @update:active-payment="handlePaymentMethodUpdate"
          />
        </div>
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
            <client-only v-if="selectedPaymentId === paypalPaymentId">
              <PayPalExpressButton
                :disabled="!termsAccepted || disableShippingPayment || cartLoading"
                @on-click="handlePayPalExpress"
                type="Checkout"
              />
              <PayPalPayLaterBanner
                placement="payment"
                :amount="cartGetters.getTotal(cartGetters.getTotals(cart))"
                :commit="true"
              />
            </client-only>
            <UiButton
              v-else-if="selectedPaymentId === paypalCreditCardPaymentId"
              type="submit"
              data-testid="place-order-button"
              @click="openPayPalCardDialog"
              :disabled="disableShippingPayment || cartLoading || paypalCardDialog"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              {{ $t('buy') }}
            </UiButton>
            <UiButton
              v-else
              type="submit"
              @click="order"
              :disabled="createOrderLoading || disableShippingPayment || cartLoading"
              size="lg"
              data-testid="place-order-button"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              <SfLoaderCircular v-if="createOrderLoading" class="flex justify-center items-center" size="sm" />
              <template v-else>{{ $t('buy') }}</template>
            </UiButton>
            <PayPalApplePayButton
              v-if="applePayAvailable"
              :style="createOrderLoading || disableShippingPayment || cartLoading ? 'pointer-events: none;' : ''"
              @button-clicked="validateTerms"
            />
          </OrderSummary>
        </div>
      </div>
    </div>

    <UiModal
      v-model="paypalCardDialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      tag="section"
      disable-click-away
    >
      <PayPalCreditCardForm @confirm-cancel="paypalCardDialog = false" />
    </UiModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import _ from 'lodash';
import PayPalExpressButton from '~/components/PayPal/PayPalExpressButton.vue';
import { PayPalCreditCardPaymentKey, PayPalPaymentKey } from '~/composables/usePayPal/types';
import { AddressType, paymentProviderGetters, cartGetters } from '@plentymarkets/shop-api';

definePageMeta({
  layout: 'simplified-header-and-footer',
  pageType: 'static',
});

const localePath = useLocalePath();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { checkboxValue: termsAccepted } = useAgreementCheckbox('checkoutGeneralTerms');
const {
  cart,
  getCart,
  clearCartItems,
  cartLoading,
  anyAddressFormIsOpen,
  persistShippingAddress,
  hasShippingAddress,
  persistBillingAddress,
  hasBillingAddress,
  backToFormEditing,
  validateTerms,
} = useCheckout();

const {
  loadPayment,
  loadShipping,
  paymentMethods,
  shippingMethods,
  selectedPaymentId,
  handleShippingMethodUpdate,
  handlePaymentMethodUpdate,
} = useCheckoutPagePaymentAndShipping();

onNuxtReady(async () => {
  useFetchAdddress(AddressType.Shipping)
    .fetchServer()
    .then(() => persistShippingAddress())
    .catch((error) => useHandleError(error));

  useFetchAdddress(AddressType.Billing)
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));
});

await getCart().then(
  async () =>
    await Promise.all([
      useCartShippingMethods().getShippingMethods(),
      usePaymentMethods().fetchPaymentMethods(),
      useActiveShippingCountries().getActiveShippingCountries(),
    ]),
);

const paypalCardDialog = ref(false);
const disableShippingPayment = computed(() => loadShipping.value || loadPayment.value);

const paypalPaymentId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalPaymentKey);
});

const paypalCreditCardPaymentId = computed(() => {
  if (!paymentMethods.value.list) return null;
  return paymentProviderGetters.getIdByPaymentKey(paymentMethods.value.list, PayPalCreditCardPaymentKey);
});

const applePayAvailable = computed(() => import.meta.client && (window as any).ApplePaySession);

const readyToBuy = () => {
  if (anyAddressFormIsOpen.value) return backToFormEditing();
  return !(!validateTerms() || !hasShippingAddress.value || !hasBillingAddress.value);
};

const openPayPalCardDialog = async () => {
  if (!readyToBuy()) return;

  paypalCardDialog.value = true;
};

const handleRegularOrder = async () => {
  const data = await createOrder({
    paymentId: paymentMethods.value.selected,
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
  });

  if (data?.order?.id) {
    clearCartItems();
    navigateTo(localePath(paths.confirmation + '/' + data.order.id + '/' + data.order.accessKey));
  }
};

const handlePayPalExpress = () => {
  if (!readyToBuy()) return;
};

const order = async () => {
  if (!readyToBuy()) return;

  const paymentMethodsById = _.keyBy(paymentMethods.value.list, 'id');

  paymentMethodsById[selectedPaymentId.value].key === 'plentyPayPal'
    ? (paypalCardDialog.value = true)
    : await handleRegularOrder();
};
</script>
