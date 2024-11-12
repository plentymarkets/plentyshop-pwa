import type { Order, MakeOrderParams } from '@plentymarkets/shop-api';
import type { UseMakeOrderState, UseMakeOrderReturn, CreateOrder } from '~/composables/useMakeOrder/types';

const ORDER_STEPS = {
  BUY: 'buy',
  PREPARE_ORDER: 'checkoutBuyButton.prepareOrder',
  PREPARE_PAYMENT: 'checkoutBuyButton.preparePayment',
  EXECUTING_PAYMENT: 'checkoutBuyButton.executingPayment',
  SUCCESS: 'checkoutBuyButton.orderCreated',
  ERROR: 'checkoutBuyButton.error',
};

/**
 * @description Composable for managing order creation.
 * @return UseMakeOrderReturn
 * @example
 * ``` ts
 * const { data, loading, createOrder } = useMakeOrder();
 * ```
 */
export const useMakeOrder: UseMakeOrderReturn = () => {
  const state = useState<UseMakeOrderState>('useMakeOrder', () => ({
    data: {} as Order,
    loading: false,
    step: ORDER_STEPS.BUY,
  }));

  /**
   * @description Function for creating an order
   * @param params { MakeOrderParams }
   * @return CreateOrder
   * @example
   * ``` ts
   * createOrder({
   *    paymentId: 1, // Method of payment
   *    shippingPrivacyHintAccepted: true,
   * });
   * ```
   */
  const createOrder: CreateOrder = async (params: MakeOrderParams) => {
    const { $i18n } = useNuxtApp();
    state.value.loading = true;

    state.value.step = ORDER_STEPS.PREPARE_ORDER;

    await useAsyncData(() =>
      useSdk().plentysystems.doAdditionalInformation({
        orderContactWish: null,
        orderCustomerSign: null,
        shippingPrivacyHintAccepted: params.shippingPrivacyHintAccepted,
        templateType: 'checkout',
      }),
    );

    state.value.step = ORDER_STEPS.PREPARE_ORDER;

    const { data: preparePaymentData, error: preparePaymentError } = await useAsyncData(() =>
      useSdk().plentysystems.doPreparePayment(),
    );

    useHandleError(preparePaymentError.value);

    const paymentType = preparePaymentData.value?.data.type || 'errorCode';
    const paymentValue = preparePaymentData.value?.data.value || '""';

    const continueOrHtmlContent = async () => {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.doPlaceOrder());

      useHandleError(error.value);

      if (error.value) {
        state.value.loading = false;
        state.value.step = ORDER_STEPS.ERROR;
        return {} as Order;
      }

      state.value.data = data.value?.data ?? state.value.data;

      state.value.step = ORDER_STEPS.EXECUTING_PAYMENT;

      await useAsyncData(() =>
        useSdk().plentysystems.doExecutePayment({
          orderId: state.value.data.order.id,
          paymentId: params.paymentId,
        }),
      );
    };

    switch (paymentType) {
      case 'continue':
      case 'htmlContent': {
        await continueOrHtmlContent();
        break;
      }

      case 'redirectUrl': {
        // redirect to given payment provider
        window.location.assign(paymentValue);
        break;
      }

      case 'externalContentUrl': {
        // show external content in iframe
        break;
      }

      case 'errorCode': {
        useNotification().send({ message: paymentValue, type: 'negative' });
        state.value.step = ORDER_STEPS.ERROR;
        break;
      }

      default: {
        useNotification().send({
          message: $i18n.t('orderErrorProvider', { paymentType: paymentType }),
          type: 'negative',
        });
        state.value.step = ORDER_STEPS.ERROR;
        break;
      }
    }

    state.value.step = ORDER_STEPS.SUCCESS;

    state.value.loading = false;
    return state.value.data;
  };

  return {
    createOrder,
    ...toRefs(state.value),
  };
};
