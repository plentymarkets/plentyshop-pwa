import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import { FetchProductReviewAverage, UseProductReviewAverage, UseProductReviewAverageState } from './types';
import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';

/**
 * @description Composable managing product reviews data
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProductReviews } = useProductReviews('product-slug');
 * @param productId
 * @param itemId
 */
export const useProductReviews: UseProductReviewAverage = (itemId: number) => {
  const state = useState<UseProductReviewAverageState>(`useProductReviewAverage-${itemId}`, () => ({
    data: {} as ReviewAverage,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @example
   * fetchProductReviews('product-slug');
   */
  const fetchProductReviews: FetchProductReviewAverage = async (itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getReviewAverage({ itemId: itemId }));
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
