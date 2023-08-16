import type { Cart } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseCartReturn, UseCartState, GetCart, AddToCart } from './types';
import { DeleteCartItem, SetCartItemQuantity } from './types';
import _ from 'lodash';

const migrateVariationData = (oldCart: Cart, nextCart: Cart): Cart => {
  if (!oldCart || !oldCart.items || !nextCart || !nextCart.items) {
    return nextCart;
  }

  nextCart.items.forEach((nextCartItem) => {
    if (nextCartItem.variation) {
      return;
    }

    const oldCartItemData = oldCart?.items?.find((oldCartItem) => oldCartItem.id === nextCartItem.id) ?? [];

    if (!oldCartItemData?.variation) {
      return;
    }

    nextCartItem.variation = oldCartItemData.variation;
  });

  return nextCart;
};

/**
 * @description Composable for managing cart.
 * @returns {@link UseCartReturn}
 * @example
 * const { data, loading } = useCart();
 */
export const useCart: UseCartReturn = () => {
  const state = useState<UseCartState>('useCart', () => ({
    data: {} as Cart,
    loading: false,
  }));

  /**
   * @description Function for fetching the cart.
   * @example
   * getCart();
   */
  const getCart: GetCart = async () => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => useSdk().plentysystems.getCart());
      useHandleError(error.value);
      state.value.data = data?.value?.data ?? state.value.data;

      console.log('response get cart : ', data?.value?.data)

      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for adding cart items.
   * @param params
   * @example
   * addToCart({
   *     productId: 1,
   *     quantity: 1,
   * });
   */
  const addToCart: AddToCart = async (params) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.doAddCartItem({
          productId: params.productId,
          quantity: params.quantity,
        }),
      );

      useHandleError(error.value);
      state.value.data =
          _.cloneDeep(migrateVariationData(state.value.data, data?.value?.data ?? ({} as Cart))) ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for updating cart item quantity.
   * @param params
   * @example
   * setCartItemQuantity({
   *     productId: 1,
   *     quantity: 1,
   *     cartItemId: 1,
   * });
   */
  const setCartItemQuantity: SetCartItemQuantity = async (params) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.setCartItemQuantity({
          productId: params.productId,
          quantity: params.quantity,
          cartItemId: params.cartItemId,
        }),
      );
      useHandleError(error.value);

      state.value.data =
        _.cloneDeep(migrateVariationData(state.value.data, data?.value?.data ?? ({} as Cart))) ?? state.value.data;
      // state.value.data = _.cloneDeep(data?.value?.data) ?? state.value.data;

      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for removing cart items.
   * @param params
   * @example
   * deleteCartItem({
   *     cartItemId: 1
   * });
   */
  const deleteCartItem: DeleteCartItem = async (params) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.deleteCartItem({
          cartItemId: params.cartItemId,
        }),
      );

      useHandleError(error.value);

      state.value.data =
          _.cloneDeep(migrateVariationData(state.value.data, data?.value?.data ?? ({} as Cart))) ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    setCartItemQuantity,
    addToCart,
    deleteCartItem,
    getCart,
    ...toRefs(state.value),
  };
};
