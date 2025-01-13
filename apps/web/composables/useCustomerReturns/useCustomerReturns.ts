import type { Order, PaginatedResult, UseUserOrderSearchParams, OrderReturnsResponse } from '@plentymarkets/shop-api';
import type {
  UseCustomerReturnsReturn,
  UseCustomerReturnsState,
  FetchCustomerReturns,
} from '~/composables/useCustomerReturns/types';

/**
 * @description Composable managing order returns data
 * @returns UseCustomerReturnsReturn
 * @example
 * ``` ts
 * const { data, loading, fetchCustomerReturns } = useCustomerReturns();
 * ```
 */
export const useCustomerReturns: UseCustomerReturnsReturn = () => {
  const state = useState<UseCustomerReturnsState>(`useCustomerReturns`, () => ({
    data: {} as PaginatedResult<Order>,
    loading: false,
    returnReasons: {} as OrderReturnsResponse,
  }));

  /** Function for fetching order returns data
   * @param params { UseUserOrderSearchParams }
   * @return FetchCustomerReturns
   * @example
   * ``` ts
   * fetchCustomerReturns({
   *    page: 1,
   * });
   * ```
   */
  const fetchCustomerReturns: FetchCustomerReturns = async (params: UseUserOrderSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData((params.page ?? 1).toString(), () =>
      useSdk().plentysystems.getReturns(params),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data || state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for getting all return reasons
   * @return Promise<void>
   * @example
   * ``` ts
   * fetchReturnReasons();
   * ```
   */
  const fetchReturnReasons = async () => {
    state.value.loading = true;
    const { data } = await useSdk().plentysystems.getReturnReasons();
    state.value.returnReasons = data;
    state.value.loading = false;
  };

  return {
    fetchCustomerReturns,
    fetchReturnReasons,
    ...toRefs(state.value),
  };
};
