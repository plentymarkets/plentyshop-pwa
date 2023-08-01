import { toRefs } from '@vueuse/shared';
import { sdk } from '~/sdk';
import type { UseCartReturn, UseCartState, GetCart } from './types';
import type { Cart } from '../../../../../plentymarkets-sdk/packages/api-client';

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
  const fetchCard: FetchCard = async () => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(() => sdk.plentysystems.getCart());
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
    fetchCard,
    ...toRefs(state.value),
  };
};
