import { toRefs } from '@vueuse/shared';
import type { Review } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { FetchProductReviews, UseProductReviews, UseProductReviewsState } from './types';
import { useSdk } from '~/sdk';

/**
 * @description Composable managing product reviews data
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProductReviews } = useProductReviews('product-slug');
 * @param productId
 * @param itemId
 */
export const useProductReviews: UseProductReviews = (productId: string | number, itemId: number) => {
  const state = useState<UseProductReviewsState>(`useProductReviews-${productId}-${itemId}`, () => ({
    data: {} as Review,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @example
   * fetchProductReviews('product-slug');
   */
  const fetchProductReviews: FetchProductReviews = async (productId: string | number, itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getReview({ itemId }));
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductReviews,
    ...toRefs(state.value),
  };
};
