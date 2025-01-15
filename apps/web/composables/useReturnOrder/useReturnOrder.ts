import type {
  SelectAll,
  SetCurrentReturnOrder,
  UseReturnOrderReturn,
  UpdateQuantity,
  UpdateReason,
  UseReturnOrderState,
  CleanReturnData,
} from './types';
import type { Order, MakeOrderReturnParams } from '@plentymarkets/shop-api';
import { orderGetters, returnGetters } from '@plentymarkets/shop-api';

/**
 * @description Composable for managing order return.
 * @returns UseReturnOrderReturn
 * @example
 * ``` ts
 * const {
 * data, loading, currentReturnOrder, returnData, setCurrentReturnOrder, updateQuantity, updateReason, selectAll,
 * cleanReturnData
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

    const { returnReasons } = useCustomerReturns();

    const returnReasonId = returnGetters.getDefaultReturnReasonId(returnReasons?.value);

    if (returnReasonId) {
      const orderItems = orderGetters.getItems(state.value.currentReturnOrder);

      orderItems.forEach((item) => {
        const variationId = orderGetters.getItemVariationId(item);

        state.value.returnData.variationIds[variationId] = {
          ...state.value.returnData.variationIds[variationId],
          returnReasonId,
        };
      });
    }
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

    orderItems.forEach((item) => {
      const variationId = orderGetters.getItemVariationId(item);

      updateQuantity(variationId, maximum ? orderGetters.getItemReturnableQty(item) : 0);
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
  const updateReason: UpdateReason = (variationId: number, returnReasonId?: number | null) => {
    if (!returnReasonId) {
      delete state.value.returnData['variationIds'][variationId]['returnReasonId'];
      return;
    }

    state.value.returnData['variationIds'][variationId] = {
      ...state.value.returnData['variationIds'][variationId],
      returnReasonId,
    };
  };

  /**
   * @description Function for cleaning the data by removing items without any quantity.
   * @return CleanReturnData
   * @example
   * ``` ts
   * cleanReturnData();
   * ```
   */
  const cleanReturnData: CleanReturnData = () => {
    const data = state.value.returnData['variationIds'];

    const filteredObject = Object.fromEntries(Object.entries(data).filter(([_, value]) => value.quantity > 0));

    state.value.returnData['variationIds'] = filteredObject;
  };

  /**
   * @description Function for making an order return.
   * @return Promise<void>
   * @example
   * ``` ts
   * makeOrderReturn();
   * ```
   */
  const makeOrderReturn = async () => {
    state.value.loading = true;
    await useAsyncData(() => useSdk().plentysystems.doMakeOrderReturn(state.value.returnData));
    state.value.loading = false;
  };
  /**
   * @description Function checking if user selected at least 1 product for return
   * @return boolean
   * @example
   * ``` ts
   * hasMinimumQuantitySelected;
   * ```
   */
  const hasMinimumQuantitySelected: Ref<boolean> = computed(() => {
    return Object.values(state.value.returnData['variationIds'] || {}).some((item) => item.quantity >= 1);
  });

  /**
   * @description Function checking if user selected a reason for products that have quantity >=1
   * @return boolean
   * @example
   * ``` ts
   * hasQuantityAndNoReasonsSelected;
   * ```
   */

  const hasQuantityAndNoReasonsSelected: Ref<boolean> = computed(() => {
    return Object.values(state.value.returnData['variationIds'] || {}).some(
      (item) => item.quantity >= 1 && !item.returnReasonId,
    );
  });

  return {
    setCurrentReturnOrder,
    updateQuantity,
    updateReason,
    cleanReturnData,
    selectAll,
    makeOrderReturn,
    hasMinimumQuantitySelected,
    hasQuantityAndNoReasonsSelected,
    ...toRefs(state.value),
  };
};
