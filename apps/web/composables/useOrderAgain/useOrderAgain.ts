import type { BasketItemOrderParamsProperty, DoAddItemParams, Order } from '@plentymarkets/shop-api';
import type {
  AddOrderToCart,
  OpenOrderAgainModal,
  UseOrderAgainReturn,
  UseOrderAgainState,
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

    state.value.order = data.value?.data.data ?? null;
    if (!state.value.order) {
      state.value.isOpen = false;
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
            valueType: property.type,
            value: property.value || 'true',
            names: {
              name: property.name,
            },
            surcharge: Number(property.surcharge),
          },
        };
      }) as BasketItemOrderParamsProperty[];

      if (orderItem.itemVariationId > 0) {
        items.push({
          productId: orderItem.itemVariationId,
          quantity: orderItem.quantity,
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
