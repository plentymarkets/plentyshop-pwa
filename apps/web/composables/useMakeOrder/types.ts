import type { Ref } from 'vue';
import type { Order, MakeOrderParams } from '@plentymarkets/shop-api';

export interface UseMakeOrderState {
  data: Order;
  loading: boolean;
}

export type CreateOrder = (params: MakeOrderParams) => Promise<Order>;

export interface ErrorMapper {
  [key: string]: () => void;
}

export interface UseMakeOrder {
  data: Readonly<Ref<UseMakeOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  createOrder: CreateOrder;
}

export type UseMakeOrderReturn = () => UseMakeOrder;
