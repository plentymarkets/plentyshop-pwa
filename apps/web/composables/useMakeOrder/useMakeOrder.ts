import type { Order, MakeOrderParams } from '@plentymarkets/shop-api';
import type { UseMakeOrderState, UseMakeOrderReturn, CreateOrder } from '~/composables/useMakeOrder/types';

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

    await useAsyncData(() =>
      useSdk().plentysystems.doAdditionalInformation({
        orderContactWish: null,
        orderCustomerSign: null,
        shippingPrivacyHintAccepted: params.shippingPrivacyHintAccepted,
        templateType: 'checkout',
      }),
    );

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
        return {} as Order;
      }

      state.value.data = data.value?.data ?? state.value.data;

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
        useHandleError({ message: paymentValue });
        break;
      }

      default: {
        useHandleError({ message: $i18n.t('orderErrorProvider', { paymentType: paymentType }) });
        break;
      }
    }

    state.value.loading = false;
    return state.value.data;
  };

  return {
    createOrder,
    ...toRefs(state.value),
  };
};
