import type { OrderSearchParams, Order, GetOrderError, ApiError } from '@plentymarkets/shop-api';
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
    const paramJsonStr = JSON.stringify(params);
    const { data, error } = await useAsyncData('useCustomerOrder.fetchOrder' + paramJsonStr, () =>
      useSdk().plentysystems.getOrder(params),
    );
    useHandleError(error.value ?? null);

    const orderData = data.value?.data as Order;
    const errorData = data.value?.data as GetOrderError;

    state.value.data = orderData?.order ? orderData : null;
    state.value.error = errorData?.error ? errorData : null;

    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for fetching an order from client side.
   * @param params { OrderSearchParams }
   * @return FetchOrder
   * @example
   * ``` ts
   * fetchOrderClient({
   *   orderId: '';
   *   accessKey: '';
   *   name: '';
   *   postcode: '';
   * })
   *
   * fetchOrderClient({
   *   orderId: '';
   * })
   * ```
   */
  const fetchOrderClient: FetchOrder = async (params: OrderSearchParams) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.getOrder(params);

      const orderData = data as Order;
      const errorData = data as GetOrderError;

      state.value.data = orderData?.order ? orderData : null;
      state.value.error = errorData?.error ? errorData : null;
    } catch (e) {
      useHandleError(e as ApiError);
    } finally {
      state.value.loading = false;
    }

    return state.value.data;
  };

  return {
    fetchOrder,
    fetchOrderClient,
    ...toRefs(state.value),
  };
};
