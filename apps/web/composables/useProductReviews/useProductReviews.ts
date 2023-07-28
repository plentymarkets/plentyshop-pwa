import { toRefs } from '@vueuse/shared';
import { sdk } from '~/sdk';
import type { FetchProductReviews, UseProductReviews, UseProductReviewsState } from './types';

/**
 * @description Composable managing product reviews data
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProductReviews } = useProductReviews('product-slug');
 * @param productId
 * @param itemId
 */
export const useProductReviews: UseProductReviews = (productId: string, itemId: number) => {
  const state = useState<UseProductReviewsState>(`useProductReviews-${productId}`, () => ({
    data: null,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @example
   * fetchProductReviews('product-slug');
   */
  const fetchProductReviews: FetchProductReviews = async (productId: string, itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => sdk.plentysystems.getReview({ productId, itemId }));
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? null;
    state.value.loading = false;
    return data;
  };

  return {
    fetchProductReviews,
    ...toRefs(state.value),
  };
};
