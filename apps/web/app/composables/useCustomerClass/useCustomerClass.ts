import type { FetchCustomerClasses, UseCustomerClassesReturn, UseCustomerClassState } from './types';
import type { ApiError } from '@plentymarkets/shop-api';

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
    data: [],
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
      const data = await useSdk().plentysystems.getCustomerClasses();
      state.value.data = data.data ?? [];
    } catch (error) {
      // getCustomerClasses requires a valid ShopBuilder editor session on the backend.
      // On a normal storefront (no editor hash) it returns `editor.invalidEditorHash`,
      // which is expected here — swallow it instead of surfacing a toast to the user.
      if ((error as ApiError)?.key !== 'editor.invalidEditorHash') {
        useHandleError(error as ApiError);
      }
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
