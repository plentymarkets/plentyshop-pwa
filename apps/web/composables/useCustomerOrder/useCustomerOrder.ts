import type { OrderSearchParams, Order, GetOrderError } from '@plentymarkets/shop-api';
import { FetchOrder, UseCustomerOrderReturn, UseCustomerOrderState } from '~/composables/useCustomerOrder/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable for get an order.
 * @returns {@link UseCustomerOrderReturn}
 * @example
 * const { data, loading, error, fetchOrder } = useCustomerOrder();
 */
export const useCustomerOrder: UseCustomerOrderReturn = (id: string) => {
  const state = useState<UseCustomerOrderState>('useCustomerOrder-' + id, () => ({
    data: null,
    loading: false,
    error: null,
  }));

  /**
   * @description Function for fetching an order.
   * @example
   * getOrder(@props: OrderSearchParams)
   */
  const fetchOrder: FetchOrder = async (params: OrderSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getOrder(params));
    useHandleError(error.value);

    const orderData = data.value?.data as Order;
    const errorData = data.value?.data as GetOrderError;

    state.value.data = orderData?.order ? orderData : null;
    state.value.error = errorData?.error ? errorData : null;

    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchOrder,
    ...toRefs(state.value),
  };
};
