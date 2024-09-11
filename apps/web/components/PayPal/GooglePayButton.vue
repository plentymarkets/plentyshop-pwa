<template>
  <div class="flex items-center justify-center w-full my-2" v-if="isGooglePayLoaded">
    <div class="border-t-2 flex-grow"></div>
    <p class="px-2 text-sm uppercase text-gray-400">{{ $t('or') }}</p>
    <div class="border-t-2 flex-grow"></div>
  </div>
  <div id="google-pay-button"></div>
</template>

<script lang="ts" setup>
import { PayPalAddToCartCallback } from '~/components/PayPal/types';
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';

let isGooglePayLoaded = false;
let countryCodeString = 'DE';
const { loadScript, executeOrder, createTransaction, captureOrder } = usePayPal();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const { createOrder } = useMakeOrder();
const { data: cart, clearCartItems } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const paypal = await loadScript(currency.value);
const localePath = useLocalePath();
const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();
const loadGooglePay = async () => {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://pay.google.com/gp/p/js/pay.js';
    scriptElement.type = 'text/javascript';
    scriptElement.addEventListener('load', resolve);
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    scriptElement.onerror = reject;
    document.head.append(scriptElement);
  });
};

let paymentsClient: google.payments.api.PaymentsClient | null = null,
  googlepayConfig: any = null;

async function getGooglePayConfig() {
  if (googlepayConfig === null) {
    googlepayConfig = await (paypal as any).Googlepay().config();
  }
  return googlepayConfig;
}

async function getGooglePaymentDataRequest() {
  const {
    allowedPaymentMethods,
    merchantInfo,
    apiVersion,
    apiVersionMinor,
    countryCode,
    transactionInfo,
    callbackIntents,
  } = await getGooglePayConfig();
  countryCodeString = countryCode;
  const baseRequest = {
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    transactionInfo,
    merchantInfo,
    callbackIntents,
  };
  const paymentDataRequest = Object.assign({}, baseRequest);
  paymentDataRequest.allowedPaymentMethods = allowedPaymentMethods;
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  paymentDataRequest.merchantInfo = merchantInfo;
  paymentDataRequest.callbackIntents = ['PAYMENT_AUTHORIZATION'];
  return paymentDataRequest;
}

function onPaymentAuthorized(paymentData: any): Promise<google.payments.api.PaymentAuthorizationResult> {
  return new Promise<google.payments.api.PaymentAuthorizationResult>((resolve) => {
    processPayment(paymentData)
      // eslint-disable-next-line promise/always-return
      .then(() => {
        resolve({
          transactionState: 'SUCCESS',
        } as google.payments.api.PaymentAuthorizationResult);
      })
      .catch((error) => {
        resolve({
          transactionState: 'ERROR',
          error: {
            message: error.message,
          },
        } as google.payments.api.PaymentAuthorizationResult);
      });
  });
}

function getGooglePaymentsClient() {
  if (paymentsClient === null) {
    paymentsClient = new google.payments.api.PaymentsClient({
      environment: 'TEST',
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized,
      },
    });
  }
  return paymentsClient;
}

async function onGooglePayLoaded() {
  const paymentsClient = getGooglePaymentsClient();
  const { allowedPaymentMethods, apiVersion, apiVersionMinor } = await getGooglePayConfig();
  try {
    const response = await paymentsClient.isReadyToPay({ allowedPaymentMethods, apiVersion, apiVersionMinor });
    isGooglePayLoaded = response.result;
    if (response.result) {
      addGooglePayButton();
    }
  } catch (error) {
    console.error(error);
  }
}

function addGooglePayButton() {
  const paymentsClient = getGooglePaymentsClient();
  const button = paymentsClient.createButton({
    onClick: onGooglePaymentButtonClicked,
  });
  const theContainer = document.querySelector('#google-pay-button');
  if (theContainer) {
    theContainer.append(button);
  }
}

function getGoogleTransactionInfo() {
  return {
    countryCode: countryCodeString,
    currencyCode: currency.value,
    totalPriceStatus: 'FINAL',
    totalPrice: cartGetters.getTotals(cart.value).total.toString(),
  };
}

async function onGooglePaymentButtonClicked() {
  emits('button-clicked', async (successfully) => {
    if (successfully) {
      const paymentDataRequest = await getGooglePaymentDataRequest();
      const paymentsClient = getGooglePaymentsClient();
      paymentsClient.loadPaymentData(paymentDataRequest);
    }
  });
}

async function processPayment(paymentData: any) {
  try {
    const transaction = await createTransaction('paypal');
    if (!transaction || !transaction.id) throw new Error('Transaction creation failed.');
    const order = await createOrder({
      paymentId: cart.value.methodOfPaymentId,
      shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
    });
    if (!order || !order.order || !order.order.id) throw new Error('Order creation failed.');

    const { status } = await (paypal as any).Googlepay().confirmOrder({
      orderId: transaction.id,
      token: paymentData.token,
      paymentMethodData: paymentData.paymentMethodData,
    });

    if (status === 'PAYER_ACTION_REQUIRED') {
      // eslint-disable-next-line promise/catch-or-return
      (paypal as any)
        .Googlepay()
        .initiatePayerAction({ orderId: order.order.id })
        // eslint-disable-next-line promise/always-return
        .then(async (data: any) => {
          await captureOrder({
            paypalOrderId: data.paypalOrderId,
            paypalPayerId: data.paypalPayerId,
          });
          await executeOrder({
            mode: 'paypal',
            plentyOrderId: Number.parseInt(orderGetters.getId(order)),
            paypalTransactionId: data.orderID,
          });
        });
    } else {
      await executeOrder({
        mode: 'paypal',
        plentyOrderId: Number.parseInt(orderGetters.getId(order)),
        paypalTransactionId: transaction.id,
      });
    }
    clearCartItems();
    navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));

    return { transactionState: 'SUCCESS' };
  } catch (error: any) {
    return {
      transactionState: 'ERROR',
      error: {
        message: error.message,
      },
    };
  }
}
onMounted(async () => {
  await loadGooglePay().then(() => {
    if (google && (paypal as any).Googlepay) {
      onGooglePayLoaded().catch(console.error);
    }
    return null;
  });
});
</script>
