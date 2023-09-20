<template>
  <NuxtLayout
    name="checkout"
    :back-href="paths.cart"
    :back-label-desktop="$t('backToCart')"
    :back-label-mobile="$t('back')"
    :heading="$t('checkout')"
  >
    <div v-if="cart" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddress
          id="billing-address"
          :heading="$t('billing.heading')"
          :description="$t('billing.description')"
          :button-text="$t('billing.addButton')"
          :addresses="billingAddresses"
          :type="AddressType.Billing"
          disabled
        />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddress
          id="shipping-address"
          :heading="$t('shipping.heading')"
          :description="$t('shipping.description')"
          :button-text="$t('shipping.addButton')"
          :addresses="shippingAddresses"
          :type="AddressType.Shipping"
          disabled
        />
        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative">
          <ShippingMethod
            :shipping-methods="shippingMethods"
            disabled
            @update:shipping-method="handleShippingMethodUpdate($event)"
          />

          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment
            :payment-methods="paymentMethods"
            disabled
            @update:active-payment="handlePaymentMethodUpdate($event)"
          />
        </div>
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
        <div class="text-sm mx-4 md:pb-0">
          <div class="flex items-center">
            <SfCheckbox
              v-model="termsAccepted"
              :invalid="showTermsError"
              @change="showTermsError = false"
              id="terms-checkbox"
              class="inline-block mr-2"
            />
            <div>
              <i18n-t keypath="termsInfo">
                <template #terms>
                  <SfLink
                    href="/TermsAndConditions"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ $t('termsAndConditions') }}
                  </SfLink>
                </template>
                <template #cancellationRights>
                  <SfLink
                    href="/CancellationRights"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ $t('cancellationRights') }}
                  </SfLink>
                </template>
                <template #privacyPolicy>
                  <SfLink
                    href="/PrivacyPolicy"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ $t('privacyPolicy') }}
                  </SfLink>
                </template>
              </i18n-t>
            </div>
          </div>
          <div v-if="showTermsError" class="text-negative-700 text-sm mt-2">{{ $t('termsRequired') }}</div>
        </div>
      </div>
      <div class="col-span-5">
        <div v-for="cartItem in cart?.items" :key="cartItem.id">
          <UiCartProductCard disabled :cart-item="cartItem" />
        </div>
        <div class="relative md:sticky mt-4 md:top-20 h-fit" :class="{ 'pointer-events-none opacity-50': cartLoading }">
          <SfLoaderCircular v-if="cartLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <OrderSummary v-if="cart" :cart="cart">
            <SfButton
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
                {{ $t('buy') }}
              </span>
            </SfButton>
          </OrderSummary>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType, PaymentMethod } from '@plentymarkets/shop-api';
import { orderGetters, shippingProviderGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfLink, SfCheckbox, SfLoaderCircular } from '@storefront-ui/vue';
import { paypalGetters } from '~/getters/paypalGetters';

definePageMeta({
  layoutName: 'checkout',
});

const ID_CHECKBOX = '#terms-checkbox';

const { data: cart, getCart, clearCartItems, loading: cartLoading } = useCart();
const { data: billingAddresses, getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);
const { data: shippingAddresses, getAddresses: getShippingAddresses } = useAddress(AddressType.Shipping);
const { data: shippingMethodData, getShippingMethods, saveShippingMethod } = useCartShippingMethods();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement, setShippingPrivacyAgreement } = useAdditionalInformation();
const router = useRouter();
const { loading: executeOrderLoading, executeOrder } = usePayPal();
const route = useRoute();

const termsAccepted = ref(false);
const showTermsError = ref(false);

const loadAddresses = async () => {
  await getBillingAddresses();
  await getShippingAddresses();
  await getShippingMethods();
};

await loadAddresses();
await getShippingMethods();
await fetchPaymentMethods();

await savePaymentMethod(
  paymentMethodData?.value?.list?.find((method: PaymentMethod) => method.name === 'PayPal')?.id ?? 0,
);

const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
const paymentMethods = computed(() => paymentMethodData.value);

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
  showTermsError.value = !termsAccepted.value;
  if (showTermsError.value) {
    scrollToHTMLObject(ID_CHECKBOX);
    return false;
  }

  return true;
};

const order = async () => {
  if (!validateTerms()) {
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
    paypalMerchantId: paypalGetters.getMerchantId() ?? '',
  });

  clearCartItems();

  if (data?.order?.id) {
    router.push('/thank-you/?orderId=' + data.order.id + '&accessKey=' + data.order.accessKey);
  }
};
</script>
