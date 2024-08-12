<template>
  <div v-if="canMakePayments" @click="initiateApplePay" class="apple-pay-button">
    <img src="@/assets/apple-pay.svg" alt="Apple Pay" />
  </div>
</template>

<script lang="ts" setup>
const { loadScript } = usePayPal();
const loadApplePay = async () => {
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js');
  scriptElement.setAttribute('type', 'text/javascript');
  document.head.append(scriptElement);
};

const canMakePayments = ref(false);

const initiateApplePay = async () => {
  try {
    const paypal = await loadScript('EUR');

    if (!paypal) {
      console.error('Paypal sdk failed');
      return;
    }

    const applePay = (paypal as any).Applepay();
    console.log(applePay);
    const paymentRequest = applePay.paymentRequest({
      countryCode: 'DE',
      currencyCode: 'EUR',
      total: {
        label: 'Store',
        amount: 100,
      },
    });

    const paymentSession = applePay.createPaymentSession(paymentRequest);

    paymentSession.begin();

    paymentSession.onvalidatemerchant = async (event: any) => {
      try {
        const validationData = await applePay.validateMerchant({
          validationUrl: event.validationUrl,
        });
        paymentSession.completeMerchantValidation(validationData);
      } catch (error) {
        console.error('Merchant validation failed:', error);
        paymentSession.abort();
      }
    };

    paymentSession.onpaymentauthorized = async (event: any) => {
      try {
        const authorization = event.payment;
        const paymentResult = await applePay.tokenizePayment(authorization);

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }

        // await props.onPaymentSuccess(paymentResult);
        // paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS);
      } catch (error) {
        console.error('Payment authorization failed:', error);
        // props.onPaymentError(error);
        // paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    paymentSession.addEventListener('cancel', () => {
      console.error('Apple pay cancel');
    });
  } catch (error) {
    console.error('Apple pay initiation failed:', error);
  }
};

// if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
//   canMakePayments.value = true;
// }

onMounted(() => {
  console.log('here');
  loadApplePay();
  initiateApplePay();
});
</script>
