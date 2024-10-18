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
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation disabled />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer :disabled="false" :type="AddressType.Shipping" :key="0" id="shipping-address" />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer :disabled="true" :type="AddressType.Billing" :key="1" id="billing-address" />
        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative">
          <ShippingMethod :shipping-methods="shippingMethods" disabled />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment :payment-methods="paymentMethods" disabled />
        </div>
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
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
            <UiButton
              type="submit"
              @click="order"
              :disabled="interactionDisabled"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              <SfLoaderCircular v-if="interactionDisabled" class="flex justify-center items-center" size="sm" />
              <template v-else>{{ t('buy') }}</template>
            </UiButton>
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType, Order, orderGetters, shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

const ID_CHECKBOX = '#terms-checkbox';
const { isAuthorized } = useCustomer();
const { data: cart, clearCartItems, loading: cartLoading } = useCart();
const { data: shippingMethodData, getShippingMethods } = useCartShippingMethods();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { loading: executeOrderLoading, executeOrder } = usePayPal();
const route = useRoute();
const { send } = useNotification();
const { t } = useI18n();
const localePath = useLocalePath();
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const { persistShippingAddress, persistBillingAddress } = useCheckout();
const { data: billingAddresses, getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);
const { data: shippingAddresses, getAddresses: getShippingAddresses, saveAddress } = useAddress(AddressType.Shipping);

const cartIsEmpty = computed(() => !cart.value?.items || cart.value?.items?.length === 0);
const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
const paymentMethods = computed(() => paymentMethodData.value);
const interactionDisabled = computed(() => createOrderLoading.value || cartLoading.value || executeOrderLoading.value);

const redirectToCart = () => {
  send({ type: 'neutral', message: t('emptyCart') });
  navigateTo(localePath(paths.cart));
};

const fetchShippingAndPaymentMethods = async () => {
  await Promise.all([
    getShippingMethods(),
    fetchPaymentMethods().then(
      async () =>
        await savePaymentMethod(paymentMethodData?.value?.list?.find((method) => method.name === 'PayPal')?.id || 0),
    ),
    useActiveShippingCountries().getActiveShippingCountries(),
  ]);
};

const handleAuthUserInit = async () => {
  useFetchAdddress(AddressType.Shipping)
    .fetchServer()
    .then(() => persistShippingAddress())
    .catch((error) => useHandleError(error));

  useFetchAdddress(AddressType.Billing)
    .fetchServer()
    .then(() => persistBillingAddress())
    .catch((error) => useHandleError(error));

  await fetchShippingAndPaymentMethods();
};

const setClientCheckoutAddress = async () => {
  await useCheckoutAddress(AddressType.Shipping)
    .set(shippingAddresses.value[0], true)
    .then(async () => await useCheckoutAddress(AddressType.Billing).set(billingAddresses.value[0], true))
    .catch((error) => useHandleError(error));
};

const handleGuestUserInit = async () => {
  await getShippingAddresses()
    .then(async () => await getBillingAddresses())
    .catch((error) => useHandleError(error));

  shippingAddresses.value.length === 0 && billingAddresses.value.length > 0
    ? await saveAddress(billingAddresses.value[0], true)
    : navigateTo(localePath(paths.cart));

  await setClientCheckoutAddress();
  await fetchShippingAndPaymentMethods();
};

onNuxtReady(async () => {
  if (cartIsEmpty.value) {
    redirectToCart();
    return;
  }

  isAuthorized.value ? await handleAuthUserInit() : await handleGuestUserInit();
});

const scrollToTerms = () => {
  scrollToHTMLObject(ID_CHECKBOX);
  setShowErrors(true);
};

const order = async () => {
  if (interactionDisabled.value) return;

  if (cartIsEmpty.value) {
    redirectToCart();
    return;
  }

  if (!termsAccepted.value) {
    scrollToTerms();
    return;
  }

  await createOrder({
    paymentId: cart.value.methodOfPaymentId,
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
  }).then(
    async (data: Order) =>
      await executeOrder({
        mode: 'paypal',
        plentyOrderId: Number.parseInt(orderGetters.getId(data)),
        paypalTransactionId: route?.query?.orderId?.toString() ?? '',
      }).finally(() => {
        clearCartItems();
        if (data?.order?.id) navigateTo(localePath('/confirmation/' + data.order.id + '/' + data.order.accessKey));
      }),
  );
};
</script>
