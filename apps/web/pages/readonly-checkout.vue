<template>
  <NuxtLayout
    name="checkout"
    page-type="static"
    :back-label-desktop="$t('backToCart')"
    :back-label-mobile="$t('back')"
    :heading="$t('checkout')"
  >
    <div v-if="cart" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider :class="dividerClass" />
        <ContactInformation disabled />
        <UiDivider :class="dividerClass" />
        <AddressContainer :disabled="false" :type="AddressType.Shipping" :key="0" id="shipping-address" />
        <UiDivider :class="dividerClass" />
        <AddressContainer :disabled="true" :type="AddressType.Billing" :key="1" id="billing-address" />
        <UiDivider :class="dividerClass" />
        <div class="relative">
          <ShippingMethod :shipping-methods="shippingMethods" disabled />
          <UiDivider :class="dividerClass" />
          <CheckoutPayment :payment-methods="paymentMethods" disabled />
        </div>
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
            <UiButton
              type="submit"
              @click="order"
              :disabled="interactionDisabled"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              <SfLoaderCircular v-if="interactionDisabled" class="flex justify-center items-center" size="sm" />
              <template v-else>{{ $t('buy') }}</template>
            </UiButton>
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType, ApiError, Order, orderGetters, shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

const ID_CHECKBOX = '#terms-checkbox';
const { isAuthorized } = useCustomer();
const { getSession } = useCustomer();
const { data: cart, cartIsEmpty, clearCartItems, loading: cartLoading } = useCart();
const { data: billingAddresses, getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);
const {
  data: shippingAddresses,
  getAddresses: getShippingAddresses,
  saveAddress: saveShippingAddress,
} = useAddress(AddressType.Shipping);
const { data: shippingMethodData, getShippingMethods } = useCartShippingMethods();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { loading: executeOrderLoading, executeOrder } = usePayPal();
const route = useRoute();
const localePath = useLocalePath();
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const { persistShippingAddress, persistBillingAddress } = useCheckout();

const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
const paymentMethods = computed(() => paymentMethodData.value);
const interactionDisabled = computed(() => createOrderLoading.value || cartLoading.value || executeOrderLoading.value);
const dividerClass = 'w-screen md:w-auto -mx-4 md:mx-0';

const fetchShippingAndPaymentMethods = async () => {
  try {
    await Promise.all([
      useAggregatedCountries().fetchAggregatedCountries(),
      getShippingMethods(),
      fetchPaymentMethods().then(
        async () =>
          await savePaymentMethod(paymentMethodData?.value?.list?.find((method) => method.name === 'PayPal')?.id || 0),
      ),
    ]);
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

const handleAuthUserInit = async () => {
  try {
    await useFetchAddress(AddressType.Shipping).fetchServer();
    await persistShippingAddress();

    await useFetchAddress(AddressType.Billing).fetchServer();
    await persistBillingAddress();

    await fetchShippingAndPaymentMethods();
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

const setClientCheckoutAddress = async () => {
  try {
    await useCheckoutAddress(AddressType.Shipping).set(shippingAddresses.value[0], true);
    await useCheckoutAddress(AddressType.Billing).set(billingAddresses.value[0], true);
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

const handleGuestUserInit = async () => {
  try {
    await getShippingAddresses();
    await getBillingAddresses();

    if (billingAddresses.value.length === 0) await navigateTo(localePath(paths.cart));
    if (shippingAddresses.value.length === 0) await saveShippingAddress(billingAddresses.value[0], true);

    await setClientCheckoutAddress();
    await fetchShippingAndPaymentMethods();
  } catch (error) {
    useHandleError(error as ApiError);
  }
};

onNuxtReady(async () => {
  await getSession();
  if (cartIsEmpty.value) await navigateTo(localePath(paths.cart));
  isAuthorized.value ? await handleAuthUserInit() : await handleGuestUserInit();
});

const scrollToTerms = () => {
  scrollToHTMLObject(ID_CHECKBOX);
  setShowErrors(true);
};

const order = async () => {
  if (interactionDisabled.value) return;
  if (cartIsEmpty.value) await navigateTo(localePath(paths.cart));
  if (!termsAccepted.value) {
    scrollToTerms();
    return;
  }

  try {
    const data: Order = await createOrder({
      paymentId: cart.value.methodOfPaymentId,
      shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    });

    await executeOrder({
      mode: 'paypal',
      plentyOrderId: Number.parseInt(orderGetters.getId(data)),
      paypalTransactionId: route?.query?.orderId?.toString() ?? '',
    });

    clearCartItems();
    if (data?.order?.id) await navigateTo(localePath('/confirmation/' + data.order.id + '/' + data.order.accessKey));
  } catch (error) {
    useHandleError(error as ApiError);
  }
};
</script>
