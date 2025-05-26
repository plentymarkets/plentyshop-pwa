import type { PaymentProviders } from '@plentymarkets/shop-api';
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
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getPaymentProviders());

    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
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
    state.value.loading = true;
    const { error } = await useAsyncData(() =>
      useSdk().plentysystems.setPaymentProvider({
        paymentId: paymentMethodId,
      }),
    );

    const { data: cart } = useCart();
    useHandleError(error.value);

    if (cart.value) {
      cart.value.methodOfPaymentId = paymentMethodId;
    }

    state.value.loading = false;
  };

  return {
    fetchPaymentMethods,
    savePaymentMethod,
    ...toRefs(state.value),
  };
};
