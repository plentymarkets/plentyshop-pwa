<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('checkout')"
  >
    <div v-if="offer" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation disabled />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddress
          id="billing-address"
          :heading="t('billing.heading')"
          :description="t('billing.description')"
          :button-text="t('billing.addButton')"
          :addresses="billingAddress"
          :type="AddressType.Billing"
          disabled
        />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <CheckoutAddress
          id="shipping-address"
          :heading="t('shipping.heading')"
          :description="t('shipping.description')"
          :button-text="t('shipping.addButton')"
          :addresses="shippingAddress"
          :type="AddressType.Shipping"
          disabled
        />
        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative">
          <ShippingMethod :shipping-methods="shippingMethods" disabled />

          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment :payment-methods="paymentMethods" disabled />
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
              <i18n-t keypath="termsInfo" scope="global">
                <template #terms>
                  <SfLink
                    :href="localePath(paths.termsAndConditions)"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ t('termsAndConditions') }}
                  </SfLink>
                </template>
                <template #cancellationRights>
                  <SfLink
                    :href="localePath(paths.cancellationRights)"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ t('cancellationRights') }}
                  </SfLink>
                </template>
                <template #privacyPolicy>
                  <SfLink
                    :href="localePath(paths.privacyPolicy)"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ t('privacyPolicy') }}
                  </SfLink>
                </template>
              </i18n-t>
            </div>
          </div>
          <div v-if="showTermsError" class="text-negative-700 text-sm mt-2">{{ t('termsRequired') }}</div>
        </div>
      </div>
      <div class="col-span-5">
        <div v-for="offerItem in offer?.order.orderItems" :key="offerItem.id">
          <div v-if="offerItem.typeId != 6">
            <p>{{ offerItem.orderItemName }}</p>
          </div>
        </div>
        <div
          class="relative md:sticky mt-4 md:top-20 h-fit"
          :class="{ 'pointer-events-none opacity-50': offerLoading }"
        >
          <SfLoaderCircular v-if="offerLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <!-- <OrderSummary v-if="offer" :cart="offer"> -->
          <UiButton type="submit" :disabled="offerLoading" size="lg" class="w-full mb-4 md:mb-0 cursor-pointer">
            <SfLoaderCircular v-if="offerLoading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('buy') }}
            </span>
          </UiButton>
          <UiButton
            type="submit"
            variant="secondary"
            @click="order"
            :disabled="offerLoading"
            size="lg"
            class="w-full mt-4 md:mb-0 cursor-pointer"
          >
            <SfLoaderCircular v-if="offerLoading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('buy') }}
            </span>
          </UiButton>
          <!-- </OrderSummary> -->
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { shippingProviderGetters, offerGetters, AddressType } from '@plentymarkets/shop-api';
import { SfLink, SfCheckbox, SfLoaderCircular } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';

definePageMeta({
  layout: 'simplified-header-and-footer',
  pageType: 'static',
});

const ID_CHECKBOX = '#terms-checkbox';

const { data: offer, loading: offerLoading, fetchOffer } = useOffer();
const route = useRoute();
const { send } = useNotification();
const { t } = useI18n();
const localePath = useLocalePath();
const { data: shippingMethodData, getShippingMethods } = useCartShippingMethods();
const { data: paymentMethodData, fetchPaymentMethods } = usePaymentMethods();

const loadOffer = async (type?: string, value?: string) => {
  const object = type === undefined || type === '' ? {} : { [type]: value };

  await fetchOffer({
    offerId: route.params.offerId as string,
    accessKey: route.params.accessKey as string,
    ...object,
  });
};

loadOffer();
await getShippingMethods();
await fetchPaymentMethods();

const termsAccepted = ref(false);
const showTermsError = ref(false);
const shippingAddress = ref(offerGetters.getShippingAddress(offer.value));
const billingAddress = ref(offerGetters.getBillingAddress(offer.value));

const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
const paymentMethods = computed(() => paymentMethodData.value);

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

const redirectBack = () => {
  if (!offer) {
    send({
      type: 'neutral',
      message: t('emptyCart'),
    });

    navigateTo(localePath(paths.cart));
    return true;
  }
  return false;
};

const order = async () => {
  if (redirectBack() || !validateTerms()) {
    return;
  }
};
</script>
