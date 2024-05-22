import type { GetOrdersResponse, UseUserOrderSearchParams } from '@plentymarkets/shop-api';

export interface UseCustomerOrdersState {
  data: GetOrdersResponse | null;
  loading: boolean;
}

export type FetchCustomerOrders = (params: UseUserOrderSearchParams) => Promise<GetOrdersResponse | null>;

export interface UseCustomerOrders {
  data: Readonly<Ref<UseCustomerOrdersState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCustomerOrders: FetchCustomerOrders;
}

export type UseCustomerOrdersReturn = () => UseCustomerOrders;
