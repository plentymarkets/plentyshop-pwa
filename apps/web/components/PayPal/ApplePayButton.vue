<template>
  <div id="apple-pay-button"></div>
</template>

<script lang="ts" setup>
import {ApplepayType, ConfigResponse} from '~/components/PayPal/types';
import {cartGetters} from "@plentymarkets/shop-api";

const { loadScript } = usePayPal();
const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const applePayConfig = ref<ConfigResponse | null>(null);
const paypal = await loadScript(currency.value);
const applePay = (paypal as any).Applepay() as ApplepayType;

const loadApplePay = async () => {
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js');
  scriptElement.setAttribute('type', 'text/javascript');
  document.head.append(scriptElement);
};

const canMakePayments = ref(false);

const applePayPayment = async () => {
  if (!applePayConfig.value) {
    return;
  }
  try {
    const paymentRequest = {
      merchantCapabilities: applePayConfig.value.merchantCapabilities,
      supportedNetworks: applePayConfig.value.supportedNetworks,
      countryCode: 'DE',
      currencyCode: currency.value,
      requiredShippingContactFields: ["name", "phone", "email", "postalAddress"],
      requiredBillingContactFields: ["postalAddress"],
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
  } catch (_e) {
    console.error(_e);
  }
}

// if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
//   canMakePayments.value = true;
// }

onMounted(async () => {
  applePay.config().then((config: ConfigResponse) => {
    applePayConfig.value = config;
    if (config.isEligible) {
      const applePayButtonContainer = document.getElementById('apple-pay-button');
      if (applePayButtonContainer) {
        applePayButtonContainer.innerHTML = '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en"/>';
        const applePayButton = document.getElementById('btn-appl');
        if (applePayButton) {
          applePayButton.addEventListener('click', () => {
            applePayPayment();
          });
        }
      }
    }
  });
});
</script>
