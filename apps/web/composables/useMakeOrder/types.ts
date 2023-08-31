import type { Ref } from 'vue';
import type { Order, MakeOrderParams } from '@plentymarkets/shop-api';

export interface UseMakeOrderState {
  data: Order;
  loading: boolean;
}

export type createOrder = (params: MakeOrderParams) => Promise<Order>;

export interface UseMakeOrder {
  data: Readonly<Ref<UseMakeOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  createOrder: createOrder;
}

export type UseMakeOrderReturn = () => UseMakeOrder;
