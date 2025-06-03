import type { OrderSearchParams, Order, GetOrderError } from '@plentymarkets/shop-api';
import type { FetchOrder, UseCustomerOrderReturn, UseCustomerOrderState } from '~/composables/useCustomerOrder/types';

/**
 * @description Composable for managing customer order.
 * @returns UseCustomerOrderReturn
 * @param id
 * @example
 * ``` ts
 * const { data, loading, error, fetchOrder } = useCustomerOrder();
 * ```
 */
export const useCustomerOrder: UseCustomerOrderReturn = (id: string) => {
  const state = useState<UseCustomerOrderState>('useCustomerOrder-' + id, () => ({
    data: null,
    loading: false,
    error: null,
  }));

  /**
   * @description Function for fetching an order.
   * @param params { OrderSearchParams }
   * @return FetchOrder
   * @example
   * ``` ts
   * fetchOrder({
   *   orderId: '';
   *   accessKey: '';
   *   name: '';
   *   postcode: '';
   * })
   *
   * fetchOrder({
   *   orderId: '';
   * })
   * ```
   */
  const fetchOrder: FetchOrder = async (params: OrderSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(
      'useCustomerOrder.fetchOrder' + params.orderId, () => useSdk().plentysystems.getOrder(params),
    );
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
