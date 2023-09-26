import type { Product, ProductParams } from '@plentymarkets/shop-api';
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
   * @example
   * fetchProduct('product-slug');
   * @param params
   */
  const fetchProduct: FetchProduct = async (params: ProductParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getProduct(params));
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
