<template>
  <div id="apple-pay-button"></div>
</template>

<script lang="ts" setup>
import { ApplepayType, ConfigResponse, PayPalAddToCartCallback } from '~/components/PayPal/types';
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';

const { getScript, executeOrder, createTransaction } = usePayPal();
const { createOrder } = useMakeOrder();
const { data: cart, clearCartItems } = useCart();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const applePayConfig = ref<ConfigResponse | null>(null);
const paypal = await getScript(currency.value);
const localePath = useLocalePath();
const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();
const loadApplePay = async () => {
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js');
  scriptElement.setAttribute('type', 'text/javascript');
  document.head.append(scriptElement);
};

const setPaymentRequest = () => {
  return {
    countryCode: applePayConfig.value?.countryCode,
    merchantCapabilities: applePayConfig.value?.merchantCapabilities,
    supportedNetworks: applePayConfig.value?.supportedNetworks,
    currencyCode: currency.value,
    requiredShippingContactFields: [],
    requiredBillingContactFields: ['postalAddress'],
    total: {
      type: 'final',
      label: 'Store',
      amount: cartGetters.getTotals(cart.value).total.toString(),
    },
  } as ApplePayJS.ApplePayPaymentRequest;
};

const applePayPayment = async () => {
  if (!applePayConfig.value) {
    return;
  }
  const applePay = (paypal as any).Applepay() as ApplepayType;
  try {
    const paymentRequest = setPaymentRequest();
    const paymentSession = new ApplePaySession(14, paymentRequest);

    paymentSession.onvalidatemerchant = async (event: ApplePayJS.ApplePayValidateMerchantEvent) => {
      try {
        const validationData = await applePay.validateMerchant({
          validationUrl: event.validationURL,
        });
        paymentSession.completeMerchantValidation(validationData.merchantSession);
      } catch (error) {
        console.error(error);
        paymentSession.abort();
      }
    };

    paymentSession.onpaymentauthorized = async (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
      try {
        const transaction = await createTransaction('applepay');
        if (!transaction || !transaction.id) throw new Error('Transaction creation failed.');

        const order = await createOrder({
          paymentId: cart.value.methodOfPaymentId,
          shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
        });
        if (!order || !order.order || !order.order.id) throw new Error('Order creation failed.');

        try {
          await applePay.confirmOrder({
            orderId: transaction.id,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
          });
        } catch (error) {
          console.error('Error during Apple Pay confirmation:', error);
          throw new Error('Apple Pay confirmation failed');
        }

        await executeOrder({
          mode: 'paypal',
          plentyOrderId: Number.parseInt(orderGetters.getId(order)),
          paypalTransactionId: transaction.id,
        });

        paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS);

        clearCartItems();

        navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
      } catch (error) {
        console.error('Error during payment process:', error);
        paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    paymentSession.addEventListener('cancel', () => {
      console.error('Apple pay cancel');
    });

    paymentSession.begin();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  await loadApplePay().then(() => {
    const applePay = (paypal as any).Applepay() as ApplepayType;
    applePay
      .config()
      .then(async (config: ConfigResponse) => {
        applePayConfig.value = config;
        if (config.isEligible) {
          const applePayButtonContainer = document.querySelector('#apple-pay-button');
          if (applePayButtonContainer) {
            applePayButtonContainer.innerHTML =
              '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en" />';

            const applePayButton = document.querySelector('#btn-appl');
            if (applePayButton) {
              applePayButton.addEventListener('click', async () => {
                emits('button-clicked', async (successfully) => {
                  if (successfully) {
                    applePayPayment();
                  }
                });
              });
            }
          }
        }
        return null;
      })
      .catch((error) => {
        console.error(error);
      });
    return null;
  });
});
</script>
