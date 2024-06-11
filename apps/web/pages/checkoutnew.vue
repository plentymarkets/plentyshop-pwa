<template>
  <NuxtLayout
    name="checkout"
    :back-href="localePath(paths.cart)"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="cart" class="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <div class="col-span-6 xl:col-span-7 mb-10 lg:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddressNew
          id="billing-address"
          :heading="useAsShippingAddress ? `${t('billing.heading')} / ${t('shipping.heading')}` : t('billing.heading')"
          :description="t('billing.description')"
          :button-text="t('billing.addButton')"
          :addresses="billingAddresses"
          ref="checkoutAddressBillingRef"
          :type="AddressType.Billing"
          @on-saved="loadAddresses"
        />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddressNew
          v-if="!useAsShippingAddress"
          id="shipping-address"
          :heading="t('shipping.heading')"
          :description="t('shipping.description')"
          :button-text="t('shipping.addButton')"
          :addresses="shippingAddresses"
          :type="AddressType.Shipping"
          @on-saved="
            async () => {
              await disableEditModeOnBillingForm();
              loadAddresses();
            }
          "
        />
        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative" :class="{ 'pointer-events-none opacity-50': disableShippingPayment }">
          <ShippingMethod
            :shipping-methods="shippingMethods"
            :disabled="disableShippingPayment"
            @update:shipping-method="handleShippingMethodUpdate($event)"
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
            @update:active-payment="handlePaymentMethodUpdate($event)"
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
                @on-click="validateTerms"
                type="Checkout"
              />
            </client-only>
            <SfButton
              v-else-if="selectedPaymentId === paypalCreditCardPaymentId"
              type="submit"
              data-testid="place-order-button"
              @click="openPayPalCardDialog"
              :disabled="disableShippingPayment || cartLoading || paypalCardDialog"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              <span>
                {{ t('buy') }}
              </span>
            </SfButton>
            <SfButton
              v-else
              type="submit"
              @click="order"
              :disabled="createOrderLoading || disableShippingPayment || cartLoading"
              size="lg"
              data-testid="place-order-button"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              <SfLoaderCircular v-if="createOrderLoading" class="flex justify-center items-center" size="sm" />
              <span v-else>
                {{ t('buy') }}
              </span>
            </SfButton>
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
import CheckoutAddressNew from '~/components/CheckoutAddressNew/CheckoutAddressNew.vue';
import { AddressType } from '@plentymarkets/shop-api';
import {
  shippingProviderGetters,
  paymentProviderGetters,
  cartGetters,
  userAddressGetters,
} from '@plentymarkets/shop-api';
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import _ from 'lodash';
import PayPalExpressButton from '~/components/PayPal/PayPalExpressButton.vue';
import { PayPalCreditCardPaymentKey, PayPalPaymentKey } from '~/composables/usePayPal/types';

definePageMeta({
  layoutName: 'checkout',
  pageType: 'static',
});

const ID_CHECKBOX = '#terms-checkbox';
const checkoutAddressBillingRef = ref<InstanceType<typeof CheckoutAddressNew> | null>(null);

const localePath = useLocalePath();
const { data: cart, getCart, clearCartItems, loading: cartLoading, useAsShippingAddress } = useCart();
const { data: billingAddresses, getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);

import { type Address } from '@plentymarkets/shop-api';
const { data: shippingAddresses, getAddresses: getShippingAddresses } = useAddress(AddressType.Shipping);
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const {
  loading: loadShipping,
  data: shippingMethodData,
  getShippingMethods,
  saveShippingMethod,
} = useCartShippingMethods();
const { loading: loadPayment, data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement, setShippingPrivacyAgreement } = useAdditionalInformation();
const { t } = useI18n();
const paypalCardDialog = ref(false);
const disableShippingPayment = computed(() => loadShipping.value || loadPayment.value);
const paypalPaymentId = computed(() =>
  paymentProviderGetters.getIdByPaymentKey(paymentMethodData.value.list, PayPalPaymentKey),
);
const paypalCreditCardPaymentId = computed(() =>
  paymentProviderGetters.getIdByPaymentKey(paymentMethodData.value.list, PayPalCreditCardPaymentKey),
);

const cartAddressId = (type: AddressType) => {
  return type === AddressType.Billing
    ? cartGetters.getCustomerInvoiceAddressId(cart.value)
    : cartGetters.getCustomerShippingAddressId(cart.value);
};

const selectedAddress = (addresses: Address[], type: AddressType) => {
  return (
    addresses.find((address) => userAddressGetters.getId(address) === cartAddressId(type)?.toString()) ??
    ({} as Address)
  );
};

const disableEditModeOnBillingForm = () => {
  if (checkoutAddressBillingRef?.value?.disableEditMode) {
    checkoutAddressBillingRef.value.disableEditMode();
  }
};

const loadAddresses = async () => {
  await Promise.all([
    getBillingAddresses(),
    getShippingAddresses(),
    getShippingMethods(),
    getCart(),
    fetchPaymentMethods(),
  ]);
  const selectedShippingAddress = selectedAddress(shippingAddresses.value, AddressType.Shipping);
  useAsShippingAddress.value = !selectedShippingAddress.id;
};

await loadAddresses();
await fetchPaymentMethods();

const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
const paymentMethods = computed(() => paymentMethodData.value);
const selectedPaymentId = computed(() => cart.value.methodOfPaymentId);

const handleShippingMethodUpdate = async (shippingMethodId: string) => {
  await saveShippingMethod(Number(shippingMethodId));
  await fetchPaymentMethods();
  await getCart();

  setShippingPrivacyAgreement(false);
};

const handlePaymentMethodUpdate = async (paymentMethodId: number) => {
  await savePaymentMethod(paymentMethodId);
  await getShippingMethods();
};

const scrollToHTMLObject = (object: string) => {
  const element = document.querySelector(object) as HTMLElement;
  const elementOffset = element?.offsetTop ?? 0;

  const headerElement = document.querySelector('header') as HTMLElement;
  const headerElementOffset = headerElement.offsetHeight ?? 0;

  window.scrollTo({
    top: elementOffset - headerElementOffset,
    behavior: 'smooth',
  });
};

const validateTerms = (): boolean => {
  setShowErrors(!termsAccepted.value);

  if (!termsAccepted.value) {
    scrollToHTMLObject(ID_CHECKBOX);
    return false;
  }

  return true;
};

const validateAddresses = () => {
  // no address validation until we establish conventions
  return true;
};

const openPayPalCardDialog = () => {
  if (!validateAddresses() || !validateTerms()) {
    return;
  }

  paypalCardDialog.value = true;
};

const handleRegularOrder = async () => {
  const data = await createOrder({
    paymentId: paymentMethodData.value.selected,
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
  });

  if (data?.order?.id) {
    clearCartItems();
    navigateTo(localePath(paths.thankYou + '/?orderId=' + data.order.id + '&accessKey=' + data.order.accessKey));
  }
};

const order = async () => {
  if (!validateAddresses() || !validateTerms()) return;

  const paymentMethodsById = _.keyBy(paymentMethods.value.list, 'id');

  paymentMethodsById[selectedPaymentId.value].key === 'plentyPayPal'
    ? (paypalCardDialog.value = true)
    : await handleRegularOrder();
};
</script>
