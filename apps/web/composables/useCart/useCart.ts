import type { Cart } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseCartReturn, UseCartState, GetCart, AddToCart } from './types';

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
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for fetching the cart.
   * @example
   * getCart();
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
      state.value.data = data?.value?.data ?? state.value.data;
      return state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    addToCart,
    getCart,
    ...toRefs(state.value),
  };
};
