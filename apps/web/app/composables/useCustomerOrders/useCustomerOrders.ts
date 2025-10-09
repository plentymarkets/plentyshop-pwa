import type {
  UseCustomerOrdersReturn,
  UseCustomerOrdersState,
  FetchCustomerOrders,
} from '~/composables/useCustomerOrders/types';

import type { ApiError, UseUserOrderSearchParams } from '@plentymarkets/shop-api';

/**
 * @description Composable managing customer orders data
 * @returns UseCustomerOrdersReturn
 * @example
 * ``` ts
 * const { data, loading, fetchCustomerOrders } = useCustomerOrders();
 * ```
 */
export const useCustomerOrders: UseCustomerOrdersReturn = () => {
  const state = useState<UseCustomerOrdersState>('useCustomerOrders', () => ({
    data: null,
    loading: false,
  }));

  /** Function for fetching customer orders data
   * @param params { UseUserOrderSearchParams }
   * @return FetchCustomerOrders
   * @example
   * ``` ts
   * fetchCustomerOrders({
   *   page: 1,
   * });
   * ```
   */
  const fetchCustomerOrders: FetchCustomerOrders = async (params: UseUserOrderSearchParams) => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getOrders(params);
      state.value.data = data ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    return state.value.data;
  };

  return {
    fetchCustomerOrders,
    ...toRefs(state.value),
  };
};
