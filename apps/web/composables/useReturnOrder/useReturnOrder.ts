import { toRefs } from '@vueuse/shared';
import {
  SelectAll,
  SetCurrentReturnOrder,
  UpdateReturnDataItems,
  UseReturnOrderReturn,
  UseReturnOrderState,
} from './types';
import type { Order } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-sdk';

/**
 * @description Composable for managing order return.
 * @returns UseReturnOrderReturn
 * @example
 * ``` ts
 * const {
 * data, loading, currentReturnOrder, returnData, setCurrentReturnOrder, updateReturnDataItems, selectAll
 * } = useReturnOrder();
 * ```
 */
export const useReturnOrder: UseReturnOrderReturn = () => {
  const state = useState<UseReturnOrderState>(`useReturnOrder`, () => ({
    data: null,
    loading: false,
    currentReturnOrder: {} as Order,
    returnData: {
      variationIds: {},
      returnNote: '',
    },
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
    };
  };

  /**
   * @description Function for updating return item quantity.
   * @return UpdateReturnDataItems
   * @example
   * ``` ts
   * updateReturnDataItems({
   *   variationId: 1,
   *   quantity: 1
   * });
   * ```
   */
  const updateReturnDataItems: UpdateReturnDataItems = (variationId, quantity) => {
    state.value.returnData['variationIds'][variationId] = quantity;
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
  const selectAll: SelectAll = (maximum) => {
    const orderItems = orderGetters.getItems(state.value.currentReturnOrder);

    if (!maximum) {
      state.value.returnData.variationIds = {};

      return;
    }

    orderItems.forEach((item) => {
      updateReturnDataItems(orderGetters.getItemVariationId(item), orderGetters.getItemQty(item));
    });
  };

  return {
    setCurrentReturnOrder,
    updateReturnDataItems,
    selectAll,
    ...toRefs(state.value),
  };
};
