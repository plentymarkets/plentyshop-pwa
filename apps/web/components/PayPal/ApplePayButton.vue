<template>
  <div id="apple-pay-button"></div>
</template>

<script lang="ts" setup>
import { ApplepayType, ConfigResponse } from '~/components/PayPal/types';
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';

const { loadScript, executeOrder, createTransaction } = usePayPal();
const { createOrder } = useMakeOrder();
const { data: cart, clearCartItems } = useCart();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const applePayConfig = ref<ConfigResponse | null>(null);
const paypal = await loadScript(currency.value);
const applePay = (paypal as any).Applepay() as ApplepayType;
const localePath = useLocalePath();

const loadApplePay = async () => {
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js');
  scriptElement.setAttribute('type', 'text/javascript');
  document.head.append(scriptElement);
};

//const canMakePayments = ref(false);

const applePayPayment = async () => {
  if (!applePayConfig.value) {
    return;
  }
  try {
    const paymentRequest = {
      countryCode: applePayConfig.value?.countryCode,
      merchantCapabilities: applePayConfig.value?.merchantCapabilities,
      supportedNetworks: applePayConfig.value?.supportedNetworks,
      currencyCode: currency.value,
      requiredShippingContactFields: ['name', 'phone', 'email', 'postalAddress'],
      requiredBillingContactFields: ['postalAddress'],
      total: {
        type: 'final',
        label: 'Store',
        amount: cartGetters.getTotals(cart.value).total.toString(),
      },
    } as ApplePayJS.ApplePayPaymentRequest;

    const paymentSession = new ApplePaySession(14, paymentRequest);
    console.log('paymentSession', paymentSession);

    paymentSession.onvalidatemerchant = (event: ApplePayJS.ApplePayValidateMerchantEvent) => {
      console.log('validate merchant');
      applePay
        .validateMerchant({
          validationUrl: event.validationURL,
        })
        .then((validationData) => {
          console.log(validationData);
          paymentSession.completeMerchantValidation(validationData.merchantSession);
        })
        .catch((error) => {
          console.error(error);
          paymentSession.abort();
        });
    };

    paymentSession.onpaymentauthorized = (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
      console.log('paymentauthorized');

      createTransaction('applepay')
        .then((order) => {
          createOrder({
            paymentId: cart.value.methodOfPaymentId,
            shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
          })
            .then((transaction) => {
              applePay
                .confirmOrder({
                  // eslint-disable-next-line promise/always-return
                  orderId: transaction?.id ?? '',
                  token: event.payment.token,
                  billingContact: event.payment.billingContact,
                  shippingContact: event.payment.shippingContact,
                })
                .then(() => {
                  executeOrder({
                    mode: 'paypal',
                    plentyOrderId: Number.parseInt(orderGetters.getId(order)),
                    // eslint-disable-next-line promise/always-return
                    paypalTransactionId: transaction?.id ?? '',
                  });
                  paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS);
                  navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
                })
                .catch((error) => {
                  console.error(error);
                  paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
                });
            })
            .catch((error) => {
              console.error(error);
              paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
            });
        })
        .catch((error) => {
          console.error(error);
          paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
        });
      clearCartItems();
      console.log('Items clear');
    };

    paymentSession.addEventListener('cancel', () => {
      console.error('Apple pay cancel');
    });

    paymentSession.begin();
  } catch (error) {
    console.error(error);
  }
};

// if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
//   canMakePayments.value = true;
// }

onMounted(async () => {
  await loadApplePay().then(() => {
    applePay.config().then((config: ConfigResponse) => {
      applePayConfig.value = config;
      console.log('this is the config', config);
      if (config.isEligible) {
        const applePayButtonContainer = document.querySelector('#apple-pay-button');
        if (applePayButtonContainer) {
          applePayButtonContainer.innerHTML =
            '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en"/>';
          const applePayButton = document.querySelector('#btn-appl');
          if (applePayButton) {
            applePayButton.addEventListener('click', () => {
              applePayPayment();
            });
          }
        }
      }
    });
  });
});
</script>
