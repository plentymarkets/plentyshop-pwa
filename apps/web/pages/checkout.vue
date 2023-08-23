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
        <UiDivider v-if="!isAuthorized" class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation v-if="!isAuthorized" />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddress
          :heading="$t('billing.heading')"
          :description="$t('billing.description')"
          :button-text="$t('billing.addButton')"
          :addresses="billingAddresses"
          :type="AddressType.Billing"
          @on-saved="loadAddresses"
        />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddress
          :heading="$t('shipping.heading')"
          :description="$t('shipping.description')"
          :button-text="$t('shipping.addButton')"
          :addresses="shippingAddresses"
          :type="AddressType.Shipping"
          @on-saved="loadAddresses"
        />
        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <ShippingMethod
          :shipping-methods="shippingMethods"
          @update:shipping-method="handleShippingMethodUpdate($event)"
        />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutPayment :payment-methods="paymentMethods" @update:active-payment="handlePaymentMethodUpdate($event)" />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
        <div class="text-sm mx-4 md:pb-0">
          <div class="flex items-center">
            <SfCheckbox v-model="termsAccepted" :invalid="showTermsError" class="terms-checkbox inline-block mr-2" />
            <div>
              <i18n-t keypath="termsInfo">
                <template #terms>
                  <SfLink
                    href="#"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ $t('termsAndConditions') }}
                  </SfLink>
                </template>
                <template #cancellation>
                  <SfLink
                    href="#"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ $t('cancellation') }}
                  </SfLink>
                </template>
                <template #privacyPolicy>
                  <SfLink
                    href="#"
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
      <OrderSummary v-if="cart" :cart="cart" class="col-span-5 md:sticky md:top-20 h-fit">
        <PayPalExpressButton v-if="selectedPaymentId === 6001" :disabled="!termsAccepted" @on-click="validateTerms" />
        <SfButton
          v-else
          type="submit"
          @click="order"
          :disabled="createOrderLoading"
          size="lg"
          class="w-full mb-4 md:mb-0 cursor-pointer"
        >
          <SfLoaderCircular v-if="createOrderLoading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ $t('buy') }}
          </span>
        </SfButton>
      </OrderSummary>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { shippingProviderGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfButton, SfLink, SfCheckbox, SfLoaderCircular } from '@storefront-ui/vue';
import PayPalExpressButton from '~/components/PayPal/PayPalExpressButton.vue';

definePageMeta({
  layout: false,
});

const { data: cart, getCart } = useCart();
const { isAuthorized } = useCustomer();
const { data: shippingMethodData, getShippingMethods, saveShippingMethod } = useCartShippingMethods();
const { data: billingAddresses, getBillingAddresses } = useBillingAddress();
const { data: shippingAddresses, getShippingAddresses } = useShippingAddress();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const { loading: createOrderLoading, createOrder } = useMakeOrder();
const { shippingPrivacyAgreement, setShippingPrivacyAgreement } = useAdditionalInformation();
const router = useRouter();

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

const scrollToTermsCheckbox = () => {
  const termsCheckboxElement = document.querySelector('.terms-checkbox') as HTMLElement; // You'll have to add an identifying class or use another selector
  const termsCheckboxElementOffset = termsCheckboxElement?.offsetTop ?? 0;

  const headerElement = document.querySelector('header') as HTMLElement; // Assuming your header has a 'header' tag or change this to the appropriate selector
  const headerElementOffset = headerElement.offsetHeight ?? 0;

  window.scrollTo({
    top: termsCheckboxElementOffset - headerElementOffset,
    behavior: 'smooth',
  });
};

const validateTerms = (): boolean => {
  showTermsError.value = !termsAccepted.value;
  if (showTermsError.value) {
    scrollToTermsCheckbox();
    return false;
  }

  return true;
};

const order = async () => {
  if (!validateTerms()) {
    return;
  }

  const data = await createOrder({
    paymentId: paymentMethodData.value.selected,
    shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
  });

  if (data?.order?.id) {
    router.push('/order/success');
  } else {
    router.push('/order/failed');
  }
};
</script>
