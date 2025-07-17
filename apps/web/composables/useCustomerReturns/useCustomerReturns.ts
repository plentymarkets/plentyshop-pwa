import type {
  Order,
  PaginatedResult,
  UseUserOrderSearchParams,
  OrderReturnsResponse,
  ApiError,
} from '@plentymarkets/shop-api';
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
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getReturns(params);
      state.value.data = data || state.value.data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
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
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getReturnReasons();
      state.value.returnReasons = data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    fetchCustomerReturns,
    fetchReturnReasons,
    ...toRefs(state.value),
  };
};
