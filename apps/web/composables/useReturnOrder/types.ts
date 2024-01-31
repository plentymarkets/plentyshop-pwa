import type { Ref } from 'vue';
import type { Order } from '@plentymarkets/shop-api';

export interface UseReturnOrderState {
  data: null;
  loading: boolean;
  currentReturnOrder: Order;
}

export type SetCurrentReturnOrder = (order: Order) => void;

export interface UseReturnOrder {
  data: Readonly<Ref<UseReturnOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  currentReturnOrder: Readonly<UseReturnOrderState['currentReturnOrder']>;
  setCurrentReturnOrder: SetCurrentReturnOrder;
}

export type UseReturnOrderReturn = () => UseReturnOrder;
