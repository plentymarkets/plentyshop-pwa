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

    try {
      const { data } = await useSdk().plentysystems.getPaymentProviders();
      state.value.data = data ?? state.value.data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

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
