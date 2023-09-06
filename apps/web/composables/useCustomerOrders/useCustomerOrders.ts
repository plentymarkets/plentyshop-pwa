import { toRefs } from '@vueuse/shared';
import type {
  UseCustomerOrdersReturn,
  UseCustomerOrdersState,
  FetchCustomerOrders,
} from '~/composables/useCustomerOrders/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable managing customer orders data
 * @returns {@link UseCustomerOrdersReturn}
 * @example
 * const { data, loading, fetchCustomerOrders } = useCustomerOrders();
 */
export const useCustomerOrders: UseCustomerOrdersReturn = () => {
  const state = useState<UseCustomerOrdersState>('useCustomerOrders', () => ({
    data: null,
    loading: false,
  }));

  /** Function for fetching customer orders data
   * @example
   * fetchCustomerOrders();
   */
  const fetchCustomerOrders: FetchCustomerOrders = async (params) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData((params.page ?? 1).toString(), () =>
      useSdk().plentysystems.getOrders(params),
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
