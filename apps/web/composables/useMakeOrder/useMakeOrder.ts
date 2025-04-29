import { additionalInformationGetters, ApiError } from '@plentymarkets/shop-api';
import type {
  UseMakeOrderState,
  UseMakeOrderReturn,
  CreateOrder,
  MakeOrderParams,
} from '~/composables/useMakeOrder/types';

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
    data: null,
    loading: false,
  }));

  const handleMakeOrderError = (error: unknown) => {
    if (error) useHandleError(error as ApiError);
    state.value.loading = false;
    useProcessingOrder().processingOrder.value = false;
    return null;
  };

  /**
   * @description Function for creating an order
   * @param params { MakeOrderParams }
   * @return CreateOrder
   * @example
   * ``` ts
   * createOrder({
   *    paymentId: 1, // Method of payment
   *    additionalInformation: { shippingPrivacyHintAccepted : true }
   * });
   * ```
   */
  const createOrder: CreateOrder = async (params: MakeOrderParams) => {
    const { $i18n } = useNuxtApp();
    state.value.loading = true;
    state.value.data = null;

    const paymentType = ref('errorCode');
    const paymentValue = ref('');

    try {
      const { data } = await useSdk().plentysystems.doPreparePayment();

      paymentType.value = data.type ?? 'errorCode';
      paymentValue.value = data.value ?? '';
    } catch (error) {
      return handleMakeOrderError(error);
    }

    const continueOrHtmlContent = async () => {
      try {
        const { data } = await useSdk().plentysystems.doPlaceOrder();
        state.value.data = data ?? state.value.data;
      } catch (error) {
        return handleMakeOrderError(error);
      }

      try {
        await useSdk().plentysystems.doExecutePayment({
          orderId: state.value.data.order.id,
          paymentId: params.paymentId,
        });
      } catch (error) {
        return handleMakeOrderError(error);
      }
    };

    switch (paymentType.value) {
      case 'continue':
      case 'htmlContent': {
        await continueOrHtmlContent();
        break;
      }

      case 'redirectUrl': {
        // redirect to given payment provider
        window.location.assign(paymentValue.value);
        break;
      }

      case 'externalContentUrl': {
        // show external content in iframe
        break;
      }

      case 'errorCode': {
        handleMakeOrderError(
          new ApiError({ key: 'null', message: paymentValue.value, code: '400', cause: paymentValue.value }),
        );
        break;
      }

      default: {
        useNotification().send({
          message: $i18n.t('orderErrorProvider', { paymentType: paymentType.value }),
          type: 'negative',
        });
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
