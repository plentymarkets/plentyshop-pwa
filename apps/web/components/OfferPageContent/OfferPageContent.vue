<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('backToCart')"
    :back-label-mobile="t('back')"
    :heading="t('offerForm.offer')"
  >
    <div v-if="offer" class="md:grid md:grid-cols-12 md:gap-x-6">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <ContactInformation disabled />
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="px-4 py-6">
          <h1 class="font-bold text-lg mb-2">{{ t('billing.heading') }}</h1>
          <AddressDisplay v-if="billingAddress" :address="billingAddress" />
        </div>
        <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="px-4 py-6">
          <h1 class="font-bold text-lg mb-2">{{ t('shipping.heading') }}</h1>
          <AddressDisplay v-if="shippingAddress" :address="shippingAddress" />
        </div>

        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div class="relative">
          <UiShippingOptionItem
            :shipping-name="offerGetters.getShippingMethodName(offer)"
            :shipping-cost="offerGetters.getShippingMethodCosts(offer)"
            :checked="true"
          />
          <UiDivider class="w-screen md:w-auto -mx-4 md:mx-0" />
          <UiPaymentOptionItem
            :payment-method-icon-path="offerGetters.getPaymentMethodIconPath(offer)"
            :payment-method-name="offerGetters.getPaymentMethodName(offer)"
            :checked="true"
            :disabled="true"
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
        <UiOfferProductCard :offer="offer" />
        <div
          class="relative md:sticky mt-4 md:top-20 h-fit"
          :class="{ 'pointer-events-none opacity-50': offerLoading }"
        >
          <SfLoaderCircular v-if="offerLoading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
          <div class="border rounded-md p-4 shadow-lg">
            <div class="flex justify-between mb-4">
              <p class="font-bold text-xl">{{ t('orderSummary') }}</p>
              <p class="font-medium">{{ t('itemsInCart', offerGetters.getOfferItemsCount(offer)) }}</p>
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
                {{ t('offerForm.acceptOffer') }}
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
                {{ t('offerForm.declineOffer') }}
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
            <h1 class="font-bold text-xl mb-2">{{ t('offerForm.declineOffer') }}</h1>
            <p class="mb-4">{{ t('offerForm.declineDialogSubline') }}</p>
            <p>{{ t('returns.commentOptional') }}</p>
            <textarea
              class="w-full min-h-32 md:min-w-96 border-2 rounded-md p-4"
              v-model="declineText"
              :placeholder="t('offerForm.inputPlaceholder')"
            />
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
                <span v-else> {{ t('offerForm.cancel') }} </span>
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
                <span v-else> {{ t('offerForm.declineOffer') }} </span>
              </UiButton>
            </div>
          </UiModal>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { offerGetters } from '@plentymarkets/shop-api';
import { SfLink, SfCheckbox, SfLoaderCircular, SfIconClose } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';
import { OfferPageContentProps } from './types';

const { loading: offerLoading } = useOffer();
const { send } = useNotification();
const { t } = useI18n();
const localePath = useLocalePath();
const props = defineProps<OfferPageContentProps>();
const emit = defineEmits(['accept', 'decline']);
const openModal = ref(false);
const declineText = ref('');

const termsAccepted = ref(false);
const showTermsError = ref(false);
const shippingAddress = computed(() => offerGetters.getShippingAddress(props.offer));
const billingAddress = computed(() => offerGetters.getBillingAddress(props.offer));

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
  if (offerGetters.getOfferItemsCount(props.offer) === 0) {
    send({
      type: 'negative',
      message: t('offer.emptyOffer'),
    });

    navigateTo(localePath(paths.cart));
    return true;
  }
  return false;
};

const order = async () => {
  if (!redirectBack() && validateTerms()) emit('accept');
};

const handleDecline = async () => {
  emit('decline', declineText.value);
};

const toggleModal = () => {
  openModal.value = !openModal.value;
};
</script>
