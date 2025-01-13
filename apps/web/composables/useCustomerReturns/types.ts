import type { Order, PaginatedResult, UseUserOrderSearchParams, OrderReturnsResponse } from '@plentymarkets/shop-api';

export interface UseCustomerReturnsState {
  data: PaginatedResult<Order>;
  loading: boolean;
  returnReasons: OrderReturnsResponse;
}

export type FetchCustomerReturns = (params: UseUserOrderSearchParams) => Promise<PaginatedResult<Order>>;
export type FetchReturnReasons = () => void;

export interface UseCustomerReturns {
  data: Readonly<Ref<UseCustomerReturnsState['data']>>;
  returnReasons: Readonly<Ref<UseCustomerReturnsState['returnReasons']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCustomerReturns: FetchCustomerReturns;
  fetchReturnReasons: FetchReturnReasons;
}

export type UseCustomerReturnsReturn = () => UseCustomerReturns;
