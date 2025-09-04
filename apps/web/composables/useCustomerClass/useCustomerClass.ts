import {FetchCustomerClasses, UseCustomerClassesReturn, UseCustomerClassState} from "./types";
import {ApiError} from "@plentymarkets/shop-api";

/**
 * @description Composable managing customer classes data
 * @returns UseCustomerClassesReturn
 * @example
 * ``` ts
 * const { data, loading, fetchCustomerClasses } = useCustomerClass();
 * ```
 */
export const useCustomerClass: UseCustomerClassesReturn = () => {
  const state = useState<UseCustomerClassState>(`useCustomerClass`, () => ({
    loading: false,
    data: null,
  }));

  /** Function for fetching customer classes
   * @return FetchCustomerClasses
   * @example
   * ``` ts
   * fetchCustomerOrders();
   * ```
   */
  const fetchCustomerClasses: FetchCustomerClasses = async () => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getCustomerClasses();
      state.value.data = data ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    return state.value.data;
  };

  return {
    fetchCustomerClasses,
    ...toRefs(state.value),
  };
};
