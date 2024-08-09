<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="cart" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation disabled />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer disabled :type="AddressType.Shipping" />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <AddressContainer disabled :type="AddressType.Billing" />
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
              :disabled="createOrderLoading || cartLoading || executeOrderLoading"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer"
            >
              <SfLoaderCircular
                v-if="createOrderLoading || cartLoading || executeOrderLoading"
                class="flex justify-center items-center"
                size="sm"
              />
              <span v-else>
                {{ t('buy') }}
              </span>
            </UiButton>
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType, type PaymentMethod, orderGetters, shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  pageType: 'static',
});

const ID_CHECKBOX = '#terms-checkbox';

const { getSession } = useCustomer();
const { data: cart, clearCartItems, loading: cartLoading } = useCart();
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
const { send } = useNotification();
const { t } = useI18n();
const localePath = useLocalePath();
const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
const { getActiveShippingCountries } = useActiveShippingCountries();

const loadAddresses = async () => {
  await getBillingAddresses();
  await getShippingAddresses();

  if (shippingAddresses.value.length === 0 && billingAddresses.value.length > 0) {
    await saveShippingAddress(billingAddresses.value[0]);
  } else if (shippingAddresses.value.length === 0 && billingAddresses.value.length === 0) {
    navigateTo(localePath(paths.cart));
  }

  await getShippingMethods();
};

const redirectBack = () => {
  if (cart.value.items?.length === 0) {
    send({
      type: 'neutral',
      message: t('emptyCart'),
    });

    navigateTo(localePath(paths.cart));
    return true;
  }
  return false;
};

await getSession();
redirectBack();
await loadAddresses();
await getActiveShippingCountries();
await getShippingMethods();
await fetchPaymentMethods();

await savePaymentMethod(
  paymentMethodData?.value?.list?.find((method: PaymentMethod) => method.name === 'PayPal')?.id ?? 0,
);

const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
const paymentMethods = computed(() => paymentMethodData.value);

const validateTerms = (): boolean => {
  if (!termsAccepted.value) {
    scrollToHTMLObject(ID_CHECKBOX);
    setShowErrors(true);
    return false;
  }
  return true;
};

const order = async () => {
  if (redirectBack() || !validateTerms()) {
    return;
  }

  const data = await createOrder({
    paymentId: cart.value.methodOfPaymentId,
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
  });

  await executeOrder({
    mode: 'paypal',
    plentyOrderId: Number.parseInt(orderGetters.getId(data)),
    paypalTransactionId: route?.query?.orderId?.toString() ?? '',
  });

  clearCartItems();

  if (data?.order?.id) {
    navigateTo(localePath('/confirmation/' + data.order.id + '/' + data.order.accessKey));
  }
};
</script>
