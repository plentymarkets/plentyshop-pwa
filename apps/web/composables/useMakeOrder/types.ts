import type { Order, MakeOrderParams } from '@plentymarkets/shop-api';

export interface UseMakeOrderState {
  data: Order;
  loading: boolean;
  step: string;
}

export type CreateOrder = (params: MakeOrderParams) => Promise<Order>;

export interface UseMakeOrder {
  data: Readonly<Ref<UseMakeOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  step: Readonly<Ref<string>>;
  createOrder: CreateOrder;
}

export type UseMakeOrderReturn = () => UseMakeOrder;
