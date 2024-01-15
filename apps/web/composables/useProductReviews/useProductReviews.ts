import type { Review } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';

import type { FetchProductReviews, UseProductReviews, UseProductReviewsState } from './types';

/**
 * @description Composable managing product reviews data
 * @param variationId
 * @param itemId
 * @returns UseProductReviews
 * @example
 * ``` ts
 * const { data, loading, fetchProductReviews } = useProductReviews(1, 1);
 * ```
 */
export const useProductReviews: UseProductReviews = (itemId: number) => {
  const state = useState<UseProductReviewsState>(`useProductReviews-${itemId}`, () => ({
    data: {} as Review,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @return FetchProductReviews
   * @example
   * ``` ts
   * fetchProductReviews(1, 1);
   * ```
   */
  const fetchProductReviews: FetchProductReviews = async (itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getReview({
        itemId: itemId,
      }),
    );
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
