import type { GooglePayConfig, GooglePayPayPal } from '~/composables/useGooglePay/types';
import { type Order, paypalGetters } from '@plentymarkets/shop-api';

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
    const { getCurrentScript } = usePayPal();
    const script = getCurrentScript();

    if (!script) return false;

    if (!state.value.scriptLoaded) {
      await loadExternalScript();
      state.value.scriptLoaded = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.value.script = (script as any).Googlepay() as GooglePayPayPal;
    state.value.googleConfig = await state.value.script.config();
    state.value.paymentsClient = getPaymentsClient();

    return true;
  };

  const getGoogleTransactionInfo = async (orderId?: number) => {
    const { data: transaction } = await useSdk().plentysystems.getPayPalGooglePayTransactionInfo({
      orderId,
    });
    return transaction as google.payments.api.TransactionInfo;
  };

  const getGooglePaymentDataRequest = async (orderId?: number) => {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: deepClone(state.value.googleConfig.allowedPaymentMethods),
      transactionInfo: await getGoogleTransactionInfo(orderId),
      merchantInfo: deepClone(state.value.googleConfig.merchantInfo),
    } as google.payments.api.PaymentDataRequest;
  };

  const showErrorNotification = (message: string) => {
    useNotification().send({
      type: 'negative',
      message,
    });
    state.value.paymentLoading = false;
  };

  const processPayment = async (paymentData: google.payments.api.PaymentData, order?: Order) => {
    if (!state.value.script) return;
    const localePath = useLocalizedPath();
    const { createTransaction, getOrder, captureOrder, createPlentyPaymentFromPayPalOrder, createPlentyOrder } =
      usePayPal();
    const { clearCartItems } = useCart();
    const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
    const { emit } = usePlentyEvent();

    state.value.paymentLoading = true;

    if (!order) {
      if (!(await useCartStockReservation().reserve())) {
        state.value.paymentLoading = false;
        return;
      }
    }

    const transaction = await createTransaction({
      type: order ? 'order' : 'basket',
      plentyOrderId: order?.order?.id,
    });
    if (!transaction || !transaction.id) {
      if (!order?.order?.id) await useCartStockReservation().unreserve();
      showErrorNotification(t('storefrontError.order.createFailed'));
      return;
    }

    let { status } = await state.value.script.confirmOrder({
      orderId: transaction.id,
      paymentMethodData: paymentData.paymentMethodData,
    });

    if (status === 'PAYER_ACTION_REQUIRED') {
      await state.value.script.initiatePayerAction({ orderId: transaction.id });
      const paypalOrder = await getOrder(transaction.id);
      status = paypalOrder?.result?.status || 'ERROR';
    }

    if (status === 'APPROVED') {
      let plentyOrder: Order | null = order || null;
      if (!order?.order?.id) {
        plentyOrder = await createPlentyOrder();
      }

      if (!plentyOrder || !plentyOrder.order || !plentyOrder.order.id) {
        showErrorNotification(t('storefrontError.order.createFailed'));
        return;
      }

      await captureOrder(transaction.id);
      await createPlentyPaymentFromPayPalOrder(transaction.id, plentyOrder.order.id);

      processingOrder.value = true;
      if (!order) {
        emit('frontend:orderCreated', plentyOrder);
        emit('module:clearCart', null);
        clearCartItems();
        navigateTo(localePath(paths.confirmation + '/' + plentyOrder.order.id + '/' + plentyOrder.order.accessKey));
      }
      state.value.paymentLoading = false;

      return { transactionState: 'SUCCESS' };
    } else {
      if (!order) await useCartStockReservation().unreserve();
      showErrorNotification(t('error.paymentFailed'));
      return { transactionState: 'ERROR' };
    }
  };

  const getIsReadyToPayRequest = (): google.payments.api.IsReadyToPayRequest => {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: deepClone(state.value.googleConfig.allowedPaymentMethods),
    } as google.payments.api.IsReadyToPayRequest;
  };

  const checkIsEligible = async () => {
    try {
      if (await initialize()) {
        const request = getIsReadyToPayRequest();
        const response = await toRaw(state.value.paymentsClient).isReadyToPay(request);

        if (response.result) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
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
