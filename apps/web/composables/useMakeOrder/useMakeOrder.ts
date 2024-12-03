import { Order, MakeOrderParams, ApiError } from '@plentymarkets/shop-api';
import { UseMakeOrderState, type UseMakeOrderReturn, type CreateOrder } from '~/composables/useMakeOrder/types';

const DEFAULT_PAYMENT_VALUE = '""';
const ORDER_STEPS = {
  BUY: 'buy',
  PREPARE_ORDER: 'checkoutBuyButton.prepareOrder',
  PREPARE_PAYMENT: 'checkoutBuyButton.preparePayment',
  CREATING_ORDER: 'checkoutBuyButton.creatingOrder',
  EXECUTING_PAYMENT: 'checkoutBuyButton.executingPayment',
  SUCCESS: 'checkoutBuyButton.orderCreated',
  ERROR: 'checkoutBuyButton.error',
};

const handleError = (error?: unknown): Order => {
  if (error) useHandleError(error as ApiError);
  return {} as Order;
};

const usePaymentActions = ({
  paymentValue,
  handleOrderCreation,
  params,
}: {
  paymentValue: string;
  handleOrderCreation: (params: MakeOrderParams) => Promise<void>;
  params: MakeOrderParams;
}): Record<string, () => Promise<void> | void> => {
  return {
    continue: async () => await handleOrderCreation(params),
    htmlContent: async () => await handleOrderCreation(params),
    redirectUrl: () => window.location.assign(paymentValue),
    externalContentUrl: () => {
      // Show external content in iframe (no implementation provided)
    },
    errorCode: () => {
      useNotification().send({ message: paymentValue, type: 'negative' });
      handleError();
    },
    default: () => {
      console.warn(`Unsupported payment type: ${paymentValue}`);
      useNotification().send({
        message: useNuxtApp().$i18n.t('orderErrorProvider', { paymentType: paymentValue }),
        type: 'negative',
      });
      handleError();
    },
  };
};

export const useMakeOrder: UseMakeOrderReturn = () => {
  const state = useState<UseMakeOrderState>('useMakeOrder', () => ({
    data: {} as Order,
    loading: false,
    step: ORDER_STEPS.BUY,
  }));

  const setStep = (step: string) => (state.value.step = step);

  const handleOrderCreation = async (params: MakeOrderParams) => {
    setStep(ORDER_STEPS.CREATING_ORDER);

    const { data, error: placeOrderError } = await useAsyncData(() => useSdk().plentysystems.doPlaceOrder());

    if (placeOrderError.value) throw placeOrderError.value;
    state.value.data = data.value?.data ?? state.value.data;

    setStep(ORDER_STEPS.EXECUTING_PAYMENT);

    const { error: doExecutePaymentError } = await useAsyncData(() =>
      useSdk().plentysystems.doExecutePayment({
        orderId: state.value.data.order.id,
        paymentId: params.paymentId,
      }),
    );

    if (doExecutePaymentError.value) throw doExecutePaymentError.value;
  };

  const createOrder: CreateOrder = async (params: MakeOrderParams) => {
    const { start: startProcessingOrder } = useProcessingOrder();

    state.value.loading = true;
    startProcessingOrder();
    setStep(ORDER_STEPS.PREPARE_ORDER);

    // Step 1: Prepare Order
    const { error: doAdditionalInformationError } = await useAsyncData(() =>
      useSdk().plentysystems.doAdditionalInformation({
        orderContactWish: null,
        orderCustomerSign: null,
        shippingPrivacyHintAccepted: params.shippingPrivacyHintAccepted,
        templateType: 'checkout',
      }),
    );

    if (doAdditionalInformationError.value) {
      state.value.loading = false;
      useProcessingOrder().stop();
      setStep(ORDER_STEPS.ERROR);
      return handleError(doAdditionalInformationError.value);
    }

    // Step 2: Prepare Payment
    const { data: preparePaymentData, error: preparePaymentError } = await useAsyncData(() =>
      useSdk().plentysystems.doPreparePayment(),
    );

    if (preparePaymentError.value) {
      state.value.loading = false;
      useProcessingOrder().stop();
      setStep(ORDER_STEPS.ERROR);
      return handleError(preparePaymentError.value);
    }

    const paymentType = preparePaymentData.value?.data.type || 'errorCode';
    const paymentValue = preparePaymentData.value?.data.value || DEFAULT_PAYMENT_VALUE;

    // Step 3: Handle Payment Action
    const paymentActions = usePaymentActions({
      paymentValue,
      handleOrderCreation,
      params,
    });
    await (paymentActions[paymentType] || paymentActions.default)();

    // Step 4: Finalize Order
    setStep(ORDER_STEPS.SUCCESS);
    state.value.loading = false;

    return state.value.data;
  };

  return {
    createOrder,
    setStep,
    ...toRefs(state.value),
  };
};
