import type {
  DoAddItemParams,
  SetCartItemQuantityParams,
  CartItem,
  CartItemError,
  ApiError,
  Cart,
  PlentyEvents,
} from '@plentymarkets/shop-api';

const migrateVariationData = (oldCart: Cart, nextCart: Cart = {} as Cart): Cart => {
  if (!oldCart || !oldCart.items || !nextCart || !nextCart.items) {
    return nextCart;
  }

  nextCart.items.forEach((nextCartItem) => {
    if (nextCartItem.variation) {
      return;
    }

    const oldCartItemData =
      oldCart?.items?.find((oldCartItem) => oldCartItem.id === nextCartItem.id) ?? ({} as CartItem);

    if (!oldCartItemData?.variation) {
      return;
    }

    nextCartItem.variation = oldCartItemData.variation;
  });

  return nextCart;
};

const isCartItemError = (data: Cart | CartItemError): data is CartItemError => {
  return 'availableStock' in data;
};

/**
 * @description Composable for managing cart.
 * @returns UseCartReturn
 * @example
 * ``` ts
 * const {
 * data, loading, getCart, setCart, clearCartItems, addToCart, setCartItemQuantity, deleteCartItem
 * } = useCart();
 * ```
 */
export const useCart = () => {
  const { emit } = usePlentyEvent();
  const state = useState('useCart', () => ({
    data: {} as Cart,
    useAsShippingAddress: true,
    loading: false,
    lastUpdatedCartItem: {} as CartItem,
  }));

  /**
   * @description Function for setting the cart state.
   * @param data { Cart }
   * @example
   * ``` ts
   * setCart(data)
   * ```
   */
  const setCart = (data: Cart) => {
    const { setPattern } = usePriceFormatter();
    state.value.data = data;
    setPattern(data.currencyPattern);
    useWishlist().setWishlistItemIds(Object.values(data?.itemWishListIds || []));
  };

  /**
   * @deprecated Use useFetchSession.getSession() instead
   */
  const getCart = async () => {
    await useFetchSession().getSession();
  };

  /**
   * @description Function for clearing cart items from state.
   * @example
   * ``` ts
   * clearCartItems()
   * ```
   */
  const clearCartItems = () => {
    state.value.data.items = [];
  };

  /**
   * @description Function for deleting the cart.
   * @example
   * ``` ts
   * await deleteCart()
   * ```
   */
  const deleteCart = async () => {
    try {
      await useSdk().plentysystems.deleteCart();
    } finally {
      clearCartItems();
    }
  };

  /**
   * @description Function for adding cart items.
   * @param params { DoAddItemParams }
   * @example
   * ``` ts
   * addToCart({
   *     productId: 1,
   *     quantity: 1,
   * });
   * ```
   */
  const addToCart = async (params: DoAddItemParams) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.doAddCartItem(params);

      state.value.data = data ? migrateVariationData(state.value.data, data) : state.value.data;

      const item = state?.value?.data?.items?.find((item) => item.variationId === params.productId);

      if (item) {
        state.value.lastUpdatedCartItem = item;
        emit('frontend:addToCart', {
          item,
          cart: state.value.data,
          addItemParams: params,
        });
      }

      return !!data;
    } catch (error) {
      const apiError = error as ApiError;
      // @TODO: Update ApiError type definition
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorEvents = apiError.events as any;
      if (errorEvents?.AfterBasketChanged?.basket) {
        state.value.data = {
          ...errorEvents.AfterBasketChanged.basket,
          items: errorEvents.AfterBasketChanged.basketItems,
        };
      }
      useHandleError(apiError);
    } finally {
      state.value.loading = false;
    }

    return false;
  };

  /**
   * @description Function for adding multiple cart items.
   * @param params { DoAddItemParams[] }
   * @example
   * ``` ts
   * addItemsToCart([{
   *     productId: 1,
   *     quantity: 1,
   * }]);
   * ```
   */
  const addItemsToCart = async (params: DoAddItemParams[]) => {
    state.value.loading = true;

    try {
      const { data } = await useSdk().plentysystems.doAddCartItems(params);

      state.value.data = migrateVariationData(state.value.data, data) ?? state.value.data;

      params.forEach((param) => {
        const item = state?.value?.data?.items?.find((item) => item.variationId === param.productId);

        if (item) {
          emit('frontend:addToCart', {
            item,
            cart: state.value.data,
            addItemParams: param,
          });
        }
      });

      return !!data;
    } catch (error) {
      const apiError = error as ApiError;
      // @TODO: Update ApiError type definition
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorEvents = apiError.events as any;
      if (errorEvents?.AfterBasketChanged?.basket) {
        state.value.data = {
          ...errorEvents.AfterBasketChanged.basket,
          items: errorEvents.AfterBasketChanged.basketItems,
        };
      }
      useHandleError(apiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  /**
   * @description Function for updating cart item quantity.
   * @param params { SetCartItemQuantityParams }
   * @example
   * ``` ts
   * setCartItemQuantity({
   *     productId: 1,
   *     quantity: 1,
   *     cartItemId: 1,
   * });
   * ```
   */
  const setCartItemQuantity = async (params: SetCartItemQuantityParams) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.setCartItemQuantity({
        productId: params.productId,
        quantity: params.quantity,
        cartItemId: params.cartItemId,
      });

      if (isCartItemError(data as unknown as Cart | CartItemError)) {
        const { $i18n } = useNuxtApp();
        const { send } = useNotification();
        const responseData = data as CartItemError;
        state.value.data.itemQuantity = responseData.availableStock;

        send({ message: $i18n.t('storefrontError.cart.reachedMaximumQuantity'), type: 'warning' });
      } else {
        state.value.data = migrateVariationData(state.value.data, data as Cart) ?? state.value.data;
        // @ts-expect-error The type of `state.value.data.apiEvents` is not recognized
        if (state.value.data?.apiEvents) {
          // @ts-expect-error The type of `state.value.data.apiEvents` is not recognized
          Object.entries(state.value.data.apiEvents as PlentyEvents).forEach(([event, data]) =>
            // @ts-expect-error The type of `state.value.data.apiEvents` is not recognized
            emit(`backend:${event}`, data),
          );
          // @ts-expect-error The type of `state.value.data.apiEvents` is not recognized
          delete state.value.data.apiEvents;
        }
      }
      return state.value.data;
    } catch (error) {
      useHandleError(error as ApiError);
      return state.value.data;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for removing cart items.
   * @param cartItem { CartItem }
   * @example
   * ``` ts
   * deleteCartItem({
   *     cartItemId: 1
   * });
   * ```
   */
  const deleteCartItem = async (cartItem: CartItem) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.deleteCartItem({
        cartItemId: cartItem.id,
      });

      state.value.data = migrateVariationData(state.value.data, data) ?? state.value.data;
      emit('frontend:removeFromCart', {
        deleteItemParams: { cartItemId: cartItem.id },
        cart: state.value.data,
        item: cartItem,
      });
      return state.value.data;
    } catch (error) {
      useHandleError(error as ApiError);
      return state.value.data;
    } finally {
      state.value.loading = false;
    }
  };

  const cartIsEmpty = computed(() => !state.value.data?.items?.length);
  const showNetPrices = computed(() => state.value.data?.showNetPrices ?? false);
  return {
    setCart,
    clearCartItems,
    setCartItemQuantity,
    addToCart,
    addItemsToCart,
    deleteCartItem,
    deleteCart,
    getCart,
    cartIsEmpty,
    showNetPrices,
    ...toRefs(state.value),
  };
};
