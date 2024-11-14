import type { Order, MakeOrderParams } from '@plentymarkets/shop-api';
import type { UseMakeOrderState, UseMakeOrderReturn, CreateOrder } from '~/composables/useMakeOrder/types';

const ORDER_STEPS = {
  BUY: 'buy',
  PREPARE_ORDER: 'checkoutBuyButton.prepareOrder',
  PREPARE_PAYMENT: 'checkoutBuyButton.preparePayment',
  CREATING_ORDER: 'checkoutBuyButton.creatingOrder',
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

  const setStep = (step: string) => {
    state.value.step = step;
  };

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
    const { start: startProcessingOrder } = useProcessingOrder();
    state.value.loading = true;
    startProcessingOrder();


    setStep(ORDER_STEPS.PREPARE_ORDER);

    const {error: doAdditionalInformationError } = await useAsyncData(() =>
      useSdk().plentysystems.doAdditionalInformation({
        orderContactWish: null,
        orderCustomerSign: null,
        shippingPrivacyHintAccepted: params.shippingPrivacyHintAccepted,
        templateType: 'checkout',
      }),
    );
    handleError(doAdditionalInformationError.value);
    setStep(ORDER_STEPS.PREPARE_ORDER);

    const { data: preparePaymentData, error: preparePaymentError } = await useAsyncData(() =>
      useSdk().plentysystems.doPreparePayment(),
    );

    handleError(preparePaymentError.value);

    const paymentType = preparePaymentData.value?.data.type || 'errorCode';
    const paymentValue = preparePaymentData.value?.data.value || '""';

    const continueOrHtmlContent = async () => {
      setStep(ORDER_STEPS.CREATING_ORDER);
      const { data, error: placeOrderError } = await useAsyncData(() => useSdk().plentysystems.doPlaceOrder());

      handleError(placeOrderError.value);

      state.value.data = data.value?.data ?? state.value.data;

      setStep(ORDER_STEPS.EXECUTING_PAYMENT);

      const { error: doExecutePaymentError } = await useAsyncData(() =>
        useSdk().plentysystems.doExecutePayment({
          orderId: state.value.data.order.id,
          paymentId: params.paymentId,
        }),
      );

      handleError(doExecutePaymentError.value);
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
        handleError();
        break;
      }

      default: {
        useNotification().send({
          message: $i18n.t('orderErrorProvider', { paymentType: paymentType }),
          type: 'negative',
        });
        handleError();
        break;
      }
    }

    setStep(ORDER_STEPS.SUCCESS);

    state.value.loading = false;
    return state.value.data;
  };

  const handleError = (error?: any) => {
    if (error) useHandleError(error);

    state.value.loading = false;
    useProcessingOrder().stop();
    setStep(ORDER_STEPS.ERROR);
    return {} as Order;
  }

  return {
    createOrder,
    setStep,
    ...toRefs(state.value),
  };
};
