<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('documents.Offer')"
  >
    <div v-if="offer" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation disabled />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="px-4 py-6">
          <h1 class="font-bold text-lg mb-2">{{ t('billing.heading') }}</h1>
          <AddressDisplay :address="billingAddress" />
        </div>
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="px-4 py-6">
          <h1 class="font-bold text-lg mb-2">{{ t('shipping.heading') }}</h1>
          <AddressDisplay :address="shippingAddress" />
        </div>

        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative">
          <div class="realtive pb-4">
            <h1 class="font-bold text-lg ml-4 mt-6">VersandKosten</h1>
            <div class="w-auto max-w-[400px] min-w-[250px] flex justify-between border rounded-md p-2 m-2">
              <div class="flex items-center flex-row gap-2">
                <SfRadio :checked="true" class="mr-2 flex items-center" />
                <span>{{ offerGetters.getShippingMethodName(offer) }}</span>
              </div>
              <span class="ml-auto flex items-center">{{
                getShippingAmount(offerGetters.getShippingMethodCosts(offer))
              }}</span>
            </div>
          </div>

          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <div class="relative pb-4">
            <h1 class="font-bold text-lg ml-4 mt-6">Bezahlmethode</h1>
            <div class="w-auto max-w-[400px] min-w-[250px] m-2 pl-1">
              <input
                type="radio"
                name="payment_method"
                class="peer sr-only"
                :data-testid="`payment-method-hier noch id`"
                :checked="true"
                :disabled="true"
              />
              <span
                class="h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-50 hover:bg-primary-50 peer-focus:border-primary-50 peer-focus:bg-primary-50 active:border-primary-100 active:bg-primary-50 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-500 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
              >
                <NuxtImg
                  :src="offer.paymentMethodIcon"
                  :alt="offer.paymentMethodName"
                  class="!h-[40px]"
                  loading="lazy"
                />
                <span class="text-xs mt-2 text-neutral-500">{{ offer.paymentMethodName }}</span>
              </span>
            </div>
          </div>
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
            <OrderSummaryProductCard :order-item="offerItem" :order="offer"></OrderSummaryProductCard>
          </div>
        </div>
        <div
          class="relative md:sticky mt-4 md:top-20 h-fit"
          :class="{ 'pointer-events-none opacity-50': offerLoading }"
        >
          <SfLoaderCircular v-if="offerLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <div class="border rounded-md p-4 shadow-lg">
            <div class="flex justify-between mb-4">
              <p class="font-bold text-xl">Bestellübersicht</p>
              <p class="font-medium">(Artikel {{ Object.keys(offer.order.orderItems).length - 1 }})</p>
            </div>
            <OrderTotals :order="offer" />
            <UiButton
              type="submit"
              @click="order"
              :disabled="offerLoading"
              size="lg"
              class="w-full mb-4 md:mb-0 cursor-pointer mt-4"
            >
              <SfLoaderCircular v-if="offerLoading" class="flex justify-center items-center" size="sm" />
              <span v-else>
                {{ t('acceptOffer') }}
              </span>
            </UiButton>
            <UiButton
              type="submit"
              variant="secondary"
              :disabled="offerLoading"
              @click="toggleModal"
              size="lg"
              class="w-full mt-4 md:mb-0 cursor-pointer"
            >
              <SfLoaderCircular v-if="offerLoading" class="flex justify-center items-center" size="sm" />
              <span v-else>
                {{ t('declineOffer') }}
              </span>
            </UiButton>
          </div>

          <UiModal
            class="h-full w-full overflow-auto md:w-[700px] md:h-fit"
            aria-labelledby="address-modal-title"
            v-model="openModal"
          >
            <UiButton square variant="tertiary" class="absolute right-2 top-2" @click="toggleModal">
              <SfIconClose />
            </UiButton>
            <h1 class="font-bold text-xl mb-2">Decline Offer</h1>
            <p class="mb-4">How can we improve?</p>
            <p>Comment (optional)</p>
            <textarea
              class="w-full min-h-32 min-w-96 border-2 rounded-md p-4"
              v-model="declineText"
              placeholder="Write your concerns here..."
            ></textarea>
            <div class="flex space-x-4">
              <UiButton
                type="submit"
                variant="primary"
                :disabled="offerLoading"
                @click="toggleModal"
                size="lg"
                class="w-full mt-4 md:mb-0 cursor-pointer"
              >
                <SfLoaderCircular v-if="offerLoading" class="flex justify-center items-center" size="sm" />
                <span v-else> Cancel </span>
              </UiButton>
              <UiButton
                type="submit"
                variant="secondary"
                :disabled="offerLoading"
                @click="handleDecline"
                size="lg"
                class="w-full mt-4 md:mb-0 cursor-pointer"
              >
                <SfLoaderCircular v-if="offerLoading" class="flex justify-center items-center" size="sm" />
                <span v-else> Decline offer </span>
              </UiButton>
            </div>
          </UiModal>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { offerGetters, PaymentProviders } from '@plentymarkets/shop-api';
import { SfLink, SfCheckbox, SfLoaderCircular, SfIconClose, SfRadio } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';
import { OfferPageContentProps } from './types';

const { send } = useNotification();
const { t, n } = useI18n();
const localePath = useLocalePath();
const { data: paymentMethodData, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
const props = defineProps<OfferPageContentProps>();
const emit = defineEmits(['accept', 'decline']);
const openModal = ref(false);
const declineText = ref('');

await fetchPaymentMethods();

const termsAccepted = ref(false);
const showTermsError = ref(false);
const shippingAddress = computed(() => offerGetters.getShippingAddress(props.offer));
const billingAddress = computed(() => offerGetters.getBillingAddress(props.offer));

const paymentMethod = computed(() => {
  const allPaymentProviders = paymentMethodData.value.list;
  const selectedPaymentMethodName = offerGetters.getPaymentMethodName(props.offer);
  const filteredProviders = allPaymentProviders.filter((provider) => provider.name === selectedPaymentMethodName);
  return {
    list: filteredProviders,
    selected: filteredProviders.length > 0 ? 0 : -1,
  } as PaymentProviders;
});

const getShippingAmount = (amount: string) => {
  return amount === '0' ? t('shippingMethod.free') : n(Number(amount), 'currency');
};


await savePaymentMethod(paymentMethod.value.list[0].id);

const ID_CHECKBOX = '#terms-checkbox';

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
  if (!props.offer) {
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
  emit('accept');
};

const handleDecline = async () => {
  emit('decline', declineText.value);
};

const toggleModal = () => {
  openModal.value = !openModal.value;
};
</script>
