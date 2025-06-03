import type { ApiError, PaymentProviders } from '@plentymarkets/shop-api';
import type { UsePaymentMethodsReturn, UsePaymentMethodsState, FetchPaymentMethods, SavePaymentMethod } from './types';

/**
 * @description Composable for managing payment methods.
 * @example
 * ``` ts
 * const { data, loading, fetchPaymentMethods, savePaymentMethod } = usePaymentMethods();
 * ```
 * TODO: Remove .selected attribute from PaymentProviders
 */
export const usePaymentMethods: UsePaymentMethodsReturn = () => {
  const state = useState<UsePaymentMethodsState>('usePaymentMethods', () => ({
    data: {} as PaymentProviders,
    loading: false,
  }));

  /**
   * @description Function for fetching payment methods.
   * @return FetchPaymentMethods
   * @example
   * ``` ts
   * fetchPaymentMethods();
   * ```
   */
  const fetchPaymentMethods: FetchPaymentMethods = async () => {
    state.value.loading = true;
    // @@@ FGE @@@
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getPaymentProviders());

    const klarnaPaymentKeys = ['klarna', 'klarnasliceit', 'klarnapaylater', 'klarnapaynow'];
    const integratedPayPalKeys = ['PAYPAL', 'PAYPAL_UNBRANDED_CARD', 'PAYPAL_GOOGLE_PAY', 'PAYPAL_APPLE_PAY'];
    const originalList = data.value?.data?.list ?? [];
    const filteredPaymentList = originalList.filter((provider) => {
      const isKlarnaViaMollie = klarnaPaymentKeys.includes(provider.paymentKey) && provider.key === 'Mollie';
      const isUnsupportedPlentyPayPal =
        provider.key === 'plentyPayPal' && !integratedPayPalKeys.includes(provider.paymentKey);

      return !isKlarnaViaMollie && !isUnsupportedPlentyPayPal;
    });

    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.data.list = filteredPaymentList ?? state.value.data.list;
    state.value.loading = false;

    return state.value.data;
  };

  /**
   * @description Function to set payment method id.
   * @param paymentMethodId
   * @return SavePaymentMethod
   * @example
   * ``` ts
   * savePaymentMethod(1);
   * ```
   */
  const savePaymentMethod: SavePaymentMethod = async (paymentMethodId: number) => {
    try {
      state.value.loading = true;
      await useSdk().plentysystems.setPaymentProvider({
        paymentId: paymentMethodId,
      });
      const { data: cart } = useCart();
      if (cart.value) {
        cart.value.methodOfPaymentId = paymentMethodId;
      }
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    fetchPaymentMethods,
    savePaymentMethod,
    ...toRefs(state.value),
  };
};
