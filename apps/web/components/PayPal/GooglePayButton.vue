<template>
  <div id="google-pay-button" />

  <div
    v-if="paymentLoading"
    class="fixed top-0 left-0 bg-black bg-opacity-75 bottom-0 right-0 !z-50 flex items-center justify-center flex-col"
  >
    <div class="text-white mb-4">{{ t('googlePay.paymentInProgress') }}</div>
    <SfLoaderCircular class="flex justify-center items-center" size="lg" />
  </div>
</template>

<script lang="ts" setup>
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';
import { SfLoaderCircular } from '@storefront-ui/vue';

const {
  initialize,
  paymentsClient,
  paymentLoading,
  getGooglePaymentDataRequest,
  processPayment,
  getIsReadyToPayRequest,
} = useGooglePay();
const { t } = useI18n();
const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();

async function onGooglePaymentButtonClicked() {
  await emits('button-clicked', async (successfully) => {
    if (successfully) {
      const paymentDataRequest = getGooglePaymentDataRequest();
      toRaw(paymentsClient.value)
        .loadPaymentData(paymentDataRequest)
        .then((paymentData: google.payments.api.PaymentData) => {
          processPayment(paymentData).catch((error: Error) => {
            useNotification().send({
              message: error.message || t('errorMessages.paymentFailed'),
              type: 'negative',
            });
            paymentLoading.value = false;
          });
          return true;
        })
        .catch((error: Error) => {
          useNotification().send({
            message: error.message || t('errorMessages.paymentFailed'),
            type: 'negative',
          });
          paymentLoading.value = false;
        });
    }
  });
}

const addGooglePayButton = () => {
  try {
    const button = toRaw(paymentsClient.value).createButton({
      onClick: onGooglePaymentButtonClicked,
    });
    const theContainer = document.querySelector('#google-pay-button');
    if (theContainer) {
      theContainer.append(button);
    }
  } catch {
    /* empty */
  }
};

const onGooglePayLoaded = async () => {
  try {
    const response = await toRaw(paymentsClient.value).isReadyToPay(getIsReadyToPayRequest());
    if (response.result) {
      addGooglePayButton();
    }
  } catch {
    /* empty */
  }
};

const createButton = async () => {
  if (await initialize()) {
    await onGooglePayLoaded();
  }
};

onMounted(async () => {
  await createButton();
});
</script>
