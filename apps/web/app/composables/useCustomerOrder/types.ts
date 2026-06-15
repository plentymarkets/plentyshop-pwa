import type { Order, OrderSearchParams, GetOrderError } from '@plentymarkets/shop-api';

export interface UseCustomerOrderState {
  data: Order | null;
  loading: boolean;
  error: GetOrderError | null;
  changePaymentMethodModalOpen: boolean;
}

export type FetchOrder = (params: OrderSearchParams) => Promise<Order | null>;
export type ChangePaymentMethod = (paymentMethodId: number) => Promise<boolean>;

export interface UseCustomerOrder {
  data: Readonly<Ref<UseCustomerOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  changePaymentMethodModalOpen: Ref<boolean>;
  fetchOrder: FetchOrder;
  refetchOrder: () => Promise<boolean>;
  fetchOrderClient: FetchOrder;
  changePaymentMethod: ChangePaymentMethod;
  error: Readonly<Ref<UseCustomerOrderState['error']>>;
}

export type UseCustomerOrderReturn = (id: string) => UseCustomerOrder;
