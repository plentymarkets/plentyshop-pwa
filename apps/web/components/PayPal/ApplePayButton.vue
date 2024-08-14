<template>
  <div id="apple-pay-button"></div>
</template>

<script lang="ts" setup>
import { ApplepayType } from '~/components/PayPal/types';

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

    const applePay = (paypal as any).Applepay() as ApplepayType;
    applePay.config().then((config) => {
      console.log(config);

      if (!config) return;

      const paymentRequest = {
        merchantCapabilities: config.merchantCapabilities,
        supportedNetworks: config.supportedNetworks,
        countryCode: 'DE',
        currencyCode: 'EUR',
        total: {
          label: 'Store',
          amount: '100',
        },
      } as ApplePayJS.ApplePayPaymentRequest;

      const paymentSession = new ApplePaySession(3, paymentRequest);

      paymentSession.begin();

      paymentSession.onvalidatemerchant = async (event: ApplePayJS.ApplePayValidateMerchantEvent) => {
        try {
          const validationData = await applePay.validateMerchant({
            validationUrl: event.validationURL,
          });
          paymentSession.completeMerchantValidation(validationData);
        } catch (error) {
          console.error('Merchant validation failed:', error);
          paymentSession.abort();
        }
      };

      paymentSession.onpaymentauthorized = async (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
        console.log(event);
      };

      paymentSession.addEventListener('cancel', () => {
        console.error('Apple pay cancel');
      });

      if (config.isEligible) {
        const dom = document.getElementById('apple-pay-button');
        if (dom) {
          dom.innerHTML = '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en" />';
          dom.addEventListener('click', () => {
            paymentSession.begin();
          });
        }
      }
    });
  } catch (error) {
    console.error('Apple pay initiation failed:', error);
  }
};

// if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
//   canMakePayments.value = true;
// }

onMounted(() => {
  initiateApplePay();
});
</script>
