import type {
  FetchCustomerOrders,
  UseCustomerOrdersReturn,
  UseCustomerOrdersState,
} from '~/composables/useCustomerOrders/types';

import type { Data, GetOrdersResponse, UseUserOrderSearchParams } from '@plentymarkets/shop-api';

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
    state.value.loading = true;
    const { data, error } = await useAsyncData(
      (params.page ?? 1).toString(),
      (): Promise<Data<GetOrdersResponse>> => useSdk().plentysystems.getOrders(params),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? null;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchCustomerOrders,
    ...toRefs(state.value),
  };
};
