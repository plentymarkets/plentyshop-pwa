import { GooglePayConfig, GooglePayPayPal } from '~/composables/useGooglePay/types';
import { cartGetters, orderGetters, paypalGetters, PayPalGooglePayAllowedPaymentMethod } from '@plentymarkets/shop-api';

const loadExternalScript = async () => {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://pay.google.com/gp/p/js/pay.js';
    scriptElement.type = 'text/javascript';
    scriptElement.addEventListener('error', reject);
    scriptElement.addEventListener('load', resolve);
    document.head.append(scriptElement);
  });
};

const getPaymentsClient = () => {
  const { config } = usePayPal();

  return new google.payments.api.PaymentsClient({
    environment: config.value ? (paypalGetters.isProduction(config.value) ? 'PRODUCTION' : 'TEST') : 'TEST',
  });
};

export const useGooglePay = () => {
  const state = useState(`useGooglePay`, () => ({
    scriptLoaded: false,
    script: null as GooglePayPayPal | null,
    googleConfig: {} as GooglePayConfig,
    paymentsClient: {} as google.payments.api.PaymentsClient,
    paymentLoading: false,
  }));

  const initialize = async () => {
    const { data: cart } = useCart();
    const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
    const { getScript } = usePayPal();
    const script = await getScript(currency.value);

    if (!script) return false;

    if (!state.value.scriptLoaded) {
      await loadExternalScript();
      state.value.scriptLoaded = true;
    }

    state.value.script = (script as any).Googlepay() as GooglePayPayPal;
    state.value.googleConfig = await state.value.script.config();
    state.value.paymentsClient = getPaymentsClient();

    return true;
  };

  const getGoogleTransactionInfo = () => {
    const { data: cart } = useCart();
    const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
    return {
      countryCode: state.value.googleConfig.countryCode,
      currencyCode: currency.value,
      totalPriceStatus: 'FINAL',
      totalPrice: cartGetters.getTotals(cart.value).total.toString(),
    } as google.payments.api.TransactionInfo;
  };

  const getGooglePaymentDataRequest = () => {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: JSON.parse(JSON.stringify(state.value.googleConfig.allowedPaymentMethods)),
      transactionInfo: getGoogleTransactionInfo(),
      merchantInfo: JSON.parse(JSON.stringify(state.value.googleConfig.merchantInfo)),
    } as google.payments.api.PaymentDataRequest;
  };

  const showErrorNotification = (message: string) => {
    useNotification().send({
      type: 'negative',
      message,
    });
    state.value.paymentLoading = false;
  };

  const processPayment = async (paymentData: google.payments.api.PaymentData) => {
    console.log('processPayment');
    if (!state.value.script) return;
    const localePath = useLocalePath();
    const { createCreditCardTransaction, getOrder, captureOrder, executeOrder } = usePayPal();
    const { data: cart, clearCartItems } = useCart();
    const { shippingPrivacyAgreement } = useAdditionalInformation();
    const { createOrder } = useMakeOrder();
    const { t } = useI18n();

    state.value.paymentLoading = true;

    console.log('processPayment 1');

    const transaction = await createCreditCardTransaction();
    if (!transaction || !transaction.id) {
      showErrorNotification(t('storefrontError.order.createFailed'));
      return;
    }

    console.log('processPayment 2');

    let { status } = await state.value.script.confirmOrder({
      orderId: transaction.id,
      paymentMethodData: paymentData.paymentMethodData,
    });

    console.log('processPayment 3');

    if (status === 'PAYER_ACTION_REQUIRED') {
      await state.value.script.initiatePayerAction({ orderId: transaction.id });
      const paypalOrder = await getOrder({
        paypalOrderId: transaction.id,
        payPalPayerId: transaction.payPalPayerId,
      });
      status = paypalOrder?.result?.status || 'ERROR';
    }

    console.log('processPayment 4');

    if (status === 'APPROVED') {
      await captureOrder({
        paypalOrderId: transaction.id,
        paypalPayerId: transaction.payPalPayerId,
      });

      const order = await createOrder({
        paymentId: cart.value.methodOfPaymentId,
        shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
      });

      if (!order || !order.order || !order.order.id) {
        showErrorNotification(t('storefrontError.order.createFailed'));
        return;
      }

      await executeOrder({
        mode: 'paypal',
        plentyOrderId: Number.parseInt(orderGetters.getId(order)),
        paypalTransactionId: transaction.id,
      });

      clearCartItems();
      navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
      state.value.paymentLoading = false;

      return { transactionState: 'SUCCESS' };
    } else {
      showErrorNotification(t('errorMessages.paymentFailed'));
      return { transactionState: 'ERROR' };
    }
  };

  const getIsReadyToPayRequest = (): google.payments.api.IsReadyToPayRequest => {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: JSON.parse(JSON.stringify(state.value.googleConfig.allowedPaymentMethods)),
    } as google.payments.api.IsReadyToPayRequest;
  };

  const checkIsEligible = async () => {
    if (await initialize()) {
      const request = getIsReadyToPayRequest();
      const response = await toRaw(state.value.paymentsClient).isReadyToPay(request);

      if (response.result) {
        await useSdk().plentysystems.doHandleAllowPaymentGooglePay({
          allowedPaymentMethods: toRaw(
            state.value.googleConfig.allowedPaymentMethods,
          ) as PayPalGooglePayAllowedPaymentMethod[],
        });
        return true;
      }
    }
    return false;
  };

  return {
    ...toRefs(state.value),
    initialize,
    getGooglePaymentDataRequest,
    processPayment,
    getIsReadyToPayRequest,
    checkIsEligible,
  };
};
