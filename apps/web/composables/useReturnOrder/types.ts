import type { Order, MakeOrderReturnParams } from '@plentymarkets/shop-api';

export interface UseReturnOrderState {
  data: null;
  loading: boolean;
  currentReturnOrder: Order;
  returnData: MakeOrderReturnParams;
}

export type SetCurrentReturnOrder = (order: Order) => void;
export type UpdateQuantity = (variationId: number, quantity: number) => void;
export type UpdateReason = (variationId: number, returnReasonId?: number | null) => void;
export type SelectAll = (maximum: boolean) => void;
export type CleanReturnData = () => void;
export type MakeOrderReturn = () => void;

export interface UseReturnOrder {
  data: Readonly<Ref<UseReturnOrderState['data']>>;
  loading: Readonly<Ref<boolean>>;
  currentReturnOrder: Readonly<Ref<UseReturnOrderState['currentReturnOrder']>>;
  returnData: Readonly<Ref<UseReturnOrderState['returnData']>>;
  setCurrentReturnOrder: SetCurrentReturnOrder;
  updateQuantity: UpdateQuantity;
  updateReason: UpdateReason;
  selectAll: SelectAll;
  cleanReturnData: CleanReturnData;
  makeOrderReturn: MakeOrderReturn;
  hasMinimumQuantitySelected: Ref<boolean>;
  hasQuantityAndNoReasonsSelected: Ref<boolean>;
}

export type UseReturnOrderReturn = () => UseReturnOrder;
