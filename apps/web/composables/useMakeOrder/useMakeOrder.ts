import type { Order, MakeOrderParams } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import type { UseMakeOrderState, UseMakeOrderReturn, createOrder } from '~/composables/useMakeOrder/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable for creating an order
 * @example
 * const { data, loading, createOrder } = useMakeOrder();
 */

export const useMakeOrder: UseMakeOrderReturn = () => {
  const state = useState<UseMakeOrderState>('useMakeOrder', () => ({
    data: {} as Order,
    loading: false,
  }));

  /**
   * @description Function for creating an order
   * @example
   * createOrder(params: MakeOrderParams);
   */
  const createOrder: createOrder = async (params: MakeOrderParams) => {
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

    switch (paymentType) {
      case 'continue': {
        const { data, error } = await useAsyncData(() => useSdk().plentysystems.doPlaceOrder());

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
      case 'htmlContent': {
        break;
      }

      case 'errorCode': {
        // NotificationService.error(paymentValue);
        break;
      }
      default: {
        // NotificationService.error("Unknown response from payment provider: " + paymentType);
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
