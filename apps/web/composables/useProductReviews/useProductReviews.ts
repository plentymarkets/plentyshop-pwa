import { toRefs } from '@vueuse/shared';
import { sdk } from '~/sdk';
import type { ReviewResponse } from '../../../../../plentymarkets-sdk/packages/api-client';
import type { UseProductReviews, UseProductReviewsState } from './types';

/**
 * @description Composable managing product reviews data
 * @param {string} slug Product slug
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProductReviews } = useProductReviews('product-slug');
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
  const fetchProductReviews: ReviewResponse = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => sdk.plentysystems.getReview({ productId: '1100', itemId: 1 }));
    useHandleError(error.value);
    state.value.data = data.value;
    state.value.loading = false;
    return data;
  };

  return {
    fetchProductReviews,
    ...toRefs(state.value),
  };
};
