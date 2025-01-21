import type { DoAddItemParams, Order, BasketItemOrderParamsProperty } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-api';
import type {
  UseOrderAgainState,
  AddOrderToCart,
  OpenOrderAgainModal,
  UseOrderAgainReturn,
  LoadOrderInformation,
} from './types';

/**
 * @description Composable managing order again data
 * @returns UseOrderAgainReturn
 * @example
 * ``` ts
 * const {
 *  loading, order, isOpen, openOrderAgainModal, addOrderToCart
 * } = useOrderAgain();
 * ```
 */
export const useOrderAgain: UseOrderAgainReturn = () => {
  const { addItemsToCart } = useCart();
  const state = useState<UseOrderAgainState>(`useOrderAgain`, () => ({
    loading: false,
    order: null,
    orderAgainOrder: null,
    hasItemsChanged: false,
    isOpen: false,
  }));

  /** Function for open the order again modal
   * @example
   * ``` ts
   * openOrderAgainModal(order);
   * ```
   */
  const loadOrderInformation: LoadOrderInformation = async (orderId, accessKey) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doOrderAgainInformation({
        orderId,
        accessKey,
      }),
    );
    useHandleError(error.value);

    if (data.value?.data?.data) {
      state.value.order = data.value.data.data;
      state.value.order.order.orderItems = orderGetters.getOrderAgainSortedChangedItems(data.value.data.data);
      state.value.hasItemsChanged = state.value.order
        ? orderGetters.hasOrderAgainChangedItems(state.value.order)
        : false;
    } else {
      state.value.isOpen = false;
      state.value.hasItemsChanged = false;
    }

    state.value.loading = false;
  };

  /** Function for open the order again modal
   * @example
   * ``` ts
   * openOrderAgainModal(order);
   * ```
   */
  const openOrderAgainModal: OpenOrderAgainModal = async (order: Order) => {
    state.value.order = order;
    state.value.isOpen = true;
    await loadOrderInformation(order.order.id.toString(), order.order.accessKey);
  };

  /** Function for adding all items from the order to cart
   * @returns Promise<boolean>
   * @example
   * ``` ts
   * addOrderToCart();
   * ```
   */
  const addOrderToCart: AddOrderToCart = async () => {
    const items: DoAddItemParams[] = [];

    state.value.order?.order.orderItems.forEach((orderItem) => {
      const properties = orderItem.orderProperties.map((property) => {
        return {
          property: {
            id: Number(property.propertyId),
            names: {
              name: property.name,
            },
            valueType: property.type,
            value: orderGetters.getOrderAgainPropertyValue(property),
          },
        };
      }) as BasketItemOrderParamsProperty[];

      if (
        orderItem.itemVariationId > 0 &&
        state.value.order &&
        orderGetters.isItemSalableAndActive(state.value.order, orderItem) &&
        orderGetters.hasAllOrderPropertiesAvailable(orderItem) &&
        orderGetters.getOrderAgainOrderItemStock(orderItem) > 0
      ) {
        items.push({
          productId: orderItem.itemVariationId,
          quantity: orderGetters.getOrderAgainOrderItemStock(orderItem),
          basketItemOrderParams: properties.length > 0 ? properties : undefined,
        });
      }
    });

    return await addItemsToCart(items);
  };

  return {
    addOrderToCart,
    openOrderAgainModal,
    loadOrderInformation,
    ...toRefs(state.value),
  };
};
