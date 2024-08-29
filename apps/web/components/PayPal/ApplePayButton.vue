<template>
  <div class="flex items-center justify-center w-full my-2" v-if="isApplepayLoaded">
    <div class="border-t-2 flex-grow"></div>
    <p class="px-2 text-sm uppercase text-gray-400">{{ $t('or') }}</p>
    <div class="border-t-2 flex-grow"></div>
  </div>
  <div id="apple-pay-button"></div>
</template>

<script lang="ts" setup>
import { ApplepayType, ConfigResponse, PayPalAddToCartCallback } from '~/components/PayPal/types';
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';

const { loadScript, executeOrder, createTransaction } = usePayPal();
const { createOrder } = useMakeOrder();
const { data: cart, clearCartItems } = useCart();
const { shippingPrivacyAgreement } = useAdditionalInformation();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const applePayConfig = ref<ConfigResponse | null>(null);
const paypal = await loadScript(currency.value);
const localePath = useLocalePath();
let isApplepayLoaded = false;

const loadApplePay = async () => {
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js');
  scriptElement.setAttribute('type', 'text/javascript');
  document.head.append(scriptElement);
};
const emits = defineEmits<{
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
}>();

const applePayPayment = async () => {
  if (!applePayConfig.value) {
    return;
  }
  const applePay = (paypal as any).Applepay() as ApplepayType;
  try {
    const paymentRequest = {
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

    const paymentSession = new ApplePaySession(14, paymentRequest);

    paymentSession.onvalidatemerchant = (event: ApplePayJS.ApplePayValidateMerchantEvent) => {
      applePay
        .validateMerchant({
          validationUrl: event.validationURL,
        })
        .then((validationData) => {
          paymentSession.completeMerchantValidation(validationData.merchantSession);
          return null;
        })
        .catch((error) => {
          console.error(error);
          paymentSession.abort();
        });
    };

    paymentSession.onpaymentauthorized = (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
      createTransaction('applepay')
        .then((transaction) => {
          createOrder({
            paymentId: cart.value.methodOfPaymentId,
            shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
          })
            .then((order) => {
              try {
                applePay
                  .confirmOrder({
                    orderId: transaction?.id ?? '',
                    token: event.payment.token,
                    billingContact: event.payment.billingContact,
                  })
                  .then(() => {
                    executeOrder({
                      mode: 'paypal',
                      plentyOrderId: Number.parseInt(orderGetters.getId(order)),
                      // eslint-disable-next-line promise/always-return
                      paypalTransactionId: transaction?.id ?? '',
                    });

                    paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS);

                    clearCartItems();

                    navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));

                    return null;
                  })
                  .catch((error) => {
                    console.error(error);
                    paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
                  });
              } catch (error) {
                console.error(error);
              }
              return null;
            })
            .catch((error) => {
              console.error(error);
              paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
            });
          return null;
        })
        .catch((error) => {
          console.error(error);
          paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
        });
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
    if (ApplePaySession.canMakePayments()) {
      isApplepayLoaded = true;
    } else {
      console.error('This device is not capable of making Apple Pay payments');
    }
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

            await nextTick();

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
