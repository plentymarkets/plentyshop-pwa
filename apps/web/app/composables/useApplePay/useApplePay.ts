import type { Order, PayPalApplePayTransactionInfo } from '@plentymarkets/shop-api';
import type { ApplepayType, ConfigResponse } from '#paypal/types';
import type { ButtonClickedEmits } from './types';

const loadExternalScript = async () => {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js';
    scriptElement.type = 'text/javascript';
    scriptElement.addEventListener('error', reject);
    scriptElement.addEventListener('load', resolve);
    document.head.append(scriptElement);
  });
};

const showErrorNotification = (message: string) => {
  useNotification().send({
    type: 'negative',
    message,
  });
};

export const useApplePay = () => {
  const state = useState(`useApplePay`, () => ({
    scriptLoaded: false,
    script: {} as ApplepayType,
    config: {} as ConfigResponse,
    transactionData: null as PayPalApplePayTransactionInfo | null,
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
    state.value.script = (script as any).Applepay() as ApplepayType;
    state.value.config = await state.value.script.config();

    return true;
  };

  const getTransactionInfo = async (orderId: number | undefined) => {
    const { data: transaction } = await useSdk().plentysystems.getPayPalApplePayTransactionInfo({
      orderId,
    });
    state.value.transactionData = transaction;
  };

  const createPaymentRequest = () => {
    const lineItems: ApplePayJS.ApplePayLineItem[] =
      state.value.transactionData?.lineItems.map((item) => ({
        label: item.label,
        amount: item.amount.toString(),
      })) ?? [];
    const total = {
      amount: state.value.transactionData?.total.amount.toString() ?? '0',
      label: state.value.transactionData?.total.label ?? 'Total',
      type: state.value.transactionData?.total.type ?? 'final',
    };

    return {
      countryCode: state.value.config.countryCode,
      merchantCapabilities: state.value.config.merchantCapabilities,
      supportedNetworks: state.value.config.supportedNetworks,
      currencyCode: state.value.config.currencyCode,
      requiredShippingContactFields: [],
      requiredBillingContactFields: ['postalAddress'],
      lineItems: lineItems,
      total: total,
    } as ApplePayJS.ApplePayPaymentRequest;
  };

  const processPayment = async (emits: ButtonClickedEmits, order?: Order) => {
    const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
    const { createTransaction, captureOrder, createPlentyOrder, createPlentyPaymentFromPayPalOrder } = usePayPal();
    const { clearCartItems } = useCart();
    const localePath = useLocalizedPath();
    const { emit } = usePlentyEvent();
    const reservation = useCartStockReservation();

    try {
      const paymentRequest = createPaymentRequest();
      const paymentSession = new ApplePaySession(14, paymentRequest);

      paymentSession.onvalidatemerchant = async (event: ApplePayJS.ApplePayValidateMerchantEvent) => {
        try {
          await emits('button-clicked', async (successfully) => {
            if (!successfully) {
              paymentSession.abort();
              return;
            }

            const validationData = await state.value.script.validateMerchant({
              validationUrl: event.validationURL,
            });
            paymentSession.completeMerchantValidation(validationData.merchantSession);
          });
        } catch {
          paymentSession.abort();
        }
      };

      paymentSession.onpaymentauthorized = async (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => {
        let plentyOrder = order;
        try {
          if (!plentyOrder && !(await reservation.reserve())) {
            paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
            return;
          }

          const transaction = await createTransaction({
            type: plentyOrder ? 'order' : 'basket',
            plentyOrderId: plentyOrder?.order?.id,
          });

          if (!transaction?.id) {
            if (!plentyOrder) await reservation.unreserve();
            paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
            showErrorNotification(t('storefrontError.order.createFailed'));
            return;
          }

          if (!plentyOrder) {
            const newOrder = await createPlentyOrder();
            if (!newOrder?.order?.id) {
              await reservation.unreserve();
              paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
              showErrorNotification(t('storefrontError.order.createFailed'));
              return;
            }
            plentyOrder = newOrder;
          }

          try {
            await state.value.script.confirmOrder({
              orderId: transaction.id,
              token: event.payment.token,
              billingContact: event.payment.billingContact,
            });
          } catch (error) {
            if (!order) await reservation.unreserve();
            paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
            showErrorNotification(error instanceof Error ? error.message : t('error.paymentFailed'));
            return;
          }

          await captureOrder(transaction.id);
          await createPlentyPaymentFromPayPalOrder(transaction.id, plentyOrder!.order.id);

          if (order) {
            emits('on-payed');
          } else {
            processingOrder.value = true;
            emit('module:clearCart', null);
            clearCartItems();
            emit('frontend:orderCreated', plentyOrder!);
          }

          paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS);
          if (!order) {
            return navigateTo(
              localePath(paths.confirmation + '/' + plentyOrder!.order.id + '/' + plentyOrder!.order.accessKey),
            );
          }
        } catch (error) {
          if (!order) await reservation.unreserve();
          showErrorNotification(error instanceof Error ? error.message : t('error.paymentFailed'));
          paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      };

      paymentSession.addEventListener('cancel', async () => {
        await useCartStockReservation().unreserve();
        paymentSession.completePayment(ApplePaySession.STATUS_FAILURE);
      });

      paymentSession.begin();
    } catch {
      showErrorNotification(t('storefrontError.unknownError'));
    }
  };

  const checkIsEligible = async () => {
    try {
      return (
        (await initialize()) &&
        typeof ApplePaySession !== 'undefined' &&
        !!state.value.script &&
        ApplePaySession &&
        ApplePaySession.canMakePayments() &&
        state.value.config.isEligible
      );
    } catch {
      return false;
    }
  };

  return {
    initialize,
    checkIsEligible,
    processPayment,
    getTransactionInfo,
    ...toRefs(state.value),
  };
};
