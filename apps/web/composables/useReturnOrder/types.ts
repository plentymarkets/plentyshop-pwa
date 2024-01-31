import type { Ref } from 'vue';
import type { Order, VariationIds } from '@plentymarkets/shop-api';

export interface ReturnData {
  variationIds: VariationIds;
  returnNote: string;
}

export interface UseReturnOrderState {
  data: null;
  loading: boolean;
  currentReturnOrder: Order;
  returnData: ReturnData;
}

export type SetCurrentReturnOrder = (order: Order) => void;
export type UpdateReturnDataItems = (variationId: number, quantity: number) => void;
export type SelectAll = (maximum: boolean) => void;

export interface UseReturnOrder {
  data: Readonly<Ref<UseReturnOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  currentReturnOrder: Readonly<Ref<UseReturnOrderState['currentReturnOrder']>>;
  returnData: Readonly<Ref<UseReturnOrderState['returnData']>>;
  setCurrentReturnOrder: SetCurrentReturnOrder;
  updateReturnDataItems: UpdateReturnDataItems;
  selectAll: SelectAll;
}

export type UseReturnOrderReturn = () => UseReturnOrder;
