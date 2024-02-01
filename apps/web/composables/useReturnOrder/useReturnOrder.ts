import { toRefs } from '@vueuse/shared';
import {
  SelectAll,
  SetCurrentReturnOrder,
  UseReturnOrderReturn,
  UpdateQuantity,
  UpdateReason,
  UseReturnOrderState,
} from './types';
import type { Order, MakeOrderReturnParams } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-sdk';
import { useSdk } from '~/sdk';

/**
 * @description Composable for managing order return.
 * @returns UseReturnOrderReturn
 * @example
 * ``` ts
 * const {
 * data, loading, currentReturnOrder, returnData, setCurrentReturnOrder, updateQuantity, updateReason, selectAll
 * } = useReturnOrder();
 * ```
 */
export const useReturnOrder: UseReturnOrderReturn = () => {
  const state = useState<UseReturnOrderState>(`useReturnOrder`, () => ({
    data: null,
    loading: false,
    currentReturnOrder: {} as Order,
    returnData: {} as MakeOrderReturnParams,
  }));

  /**
   * @description Function for setting the current order.
   * @return SetCurrentReturnOrder
   * @example
   * ``` ts
   * setCurrentReturnOrder({
   *   order: {},
   * });
   * ```
   */
  const setCurrentReturnOrder: SetCurrentReturnOrder = (order: Order) => {
    state.value.currentReturnOrder = order;
    state.value.returnData = {
      variationIds: {},
      returnNote: '',
      orderId: Number(orderGetters.getId(order)),
      orderAccessKey: orderGetters.getAccessKey(order),
    };
  };

  /**
   * @description Function for updating return item quantity.
   * @return UpdateQuantity
   * @example
   * ``` ts
   * updateQuantity({
   *   variationId: 1,
   *   quantity: 1,
   * });
   * ```
   */
  const updateQuantity: UpdateQuantity = (variationId: number, quantity: number) => {
    if (!quantity) {
      delete state.value.returnData['variationIds'][variationId];
      return;
    }

    state.value.returnData['variationIds'][variationId] = {
      ...state.value.returnData['variationIds'][variationId],
      quantity,
    };
  };

  /**
   * @description Function for selecting maximum quantity for all items.
   * @return SelectAll
   * @example
   * ``` ts
   * selectAll(true);
   * selectAll(false);
   * ```
   */
  const selectAll: SelectAll = (maximum: boolean) => {
    const orderItems = orderGetters.getItems(state.value.currentReturnOrder);

    if (!maximum) {
      state.value.returnData.variationIds = {};

      return;
    }

    orderItems.forEach((item) => {
      const variationId = orderGetters.getItemVariationId(item);

      updateQuantity(variationId, orderGetters.getItemQty(item));
    });
  };

  /**
   * @description Function for updating return item reason.
   * @return UpdateReason
   * @example
   * ``` ts
   * updateReason({
   *   variationId: 1,
   *   reasonId: 1
   * });
   * ```
   */
  const updateReason: UpdateReason = (variationId: number, returnReasonId?: number) => {
    if (!returnReasonId) {
      delete state.value.returnData['variationIds'][variationId]['returnReasonId'];
      return;
    }

    state.value.returnData['variationIds'][variationId] = {
      ...state.value.returnData['variationIds'][variationId],
      returnReasonId,
    };
  };

  const makeOrderReturn = async () => {
    state.value.loading = true;
    await useAsyncData(() => useSdk().plentysystems.doMakeOrderReturn(state.value.returnData));
    state.value.loading = false;
  };

  return {
    setCurrentReturnOrder,
    updateQuantity,
    updateReason,
    selectAll,
    makeOrderReturn,
    ...toRefs(state.value),
  };
};
