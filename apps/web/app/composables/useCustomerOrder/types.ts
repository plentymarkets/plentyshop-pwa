import type { Order, OrderSearchParams, GetOrderError } from '@plentymarkets/shop-api';

export interface UseCustomerOrderState {
  data: Order | null;
  loading: boolean;
  error: GetOrderError | null;
}

export type FetchOrder = (params: OrderSearchParams) => Promise<Order | null>;

export interface UseCustomerOrder {
  data: Readonly<Ref<UseCustomerOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchOrder: FetchOrder;
  fetchOrderClient: FetchOrder;
  error: Readonly<Ref<UseCustomerOrderState['error']>>;
}

export type UseCustomerOrderReturn = (id: string) => UseCustomerOrder;
