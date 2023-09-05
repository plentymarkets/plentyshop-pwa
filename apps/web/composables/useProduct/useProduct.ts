import type { Product } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import type { UseProductReturn, UseProductState, FetchProduct } from './types';

/**
 * @description Composable managing product data
 * @param {string} slug Product slug
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProduct } = useProduct('product-slug');
 */
export const useProduct: UseProductReturn = (slug) => {
  const state = useState<UseProductState>(`useProduct-${slug}`, () => ({
    data: {} as Product,
    loading: false,
  }));

  /** Function for fetching product data
   * @param {string} slug Product slug
   * @example
   * fetchProduct('product-slug');
   */
  const fetchProduct: FetchProduct = async (slug) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(slug + new Date().getTime(), () => useSdk().plentysystems.getProduct({ id: slug }));
    useHandleError(error.value);

    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProduct,
    ...toRefs(state.value),
  };
};
