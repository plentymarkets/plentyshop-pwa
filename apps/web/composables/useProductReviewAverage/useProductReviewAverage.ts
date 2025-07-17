import type { ReviewAverage } from '@plentymarkets/shop-api';
import type { FetchProductReviewAverage, UseProductReviewAverage, UseProductReviewAverageState } from './types';

/**
 * @description Composable managing review average data
 * @param itemId
 * @returns UseProductReviewsAverageReturn
 * @example
 * ``` ts
 * const { data, loading, fetchProductReviewAverage } = useProductReviewAverage(itemId);
 * ```
 */
export const useProductReviewAverage: UseProductReviewAverage = () => {
  const state = useState<UseProductReviewAverageState>(`useProductReviewAverage`, () => ({
    data: {} as ReviewAverage,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @param itemId
   * @return FetchProductReviewAverage
   * @example
   * ``` ts
   * fetchProductReviewAverage(1);
   * ```
   */
  const fetchProductReviewAverage: FetchProductReviewAverage = async (itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getReviewAverage({ itemId }));
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductReviewAverage,
    ...toRefs(state.value),
  };
};
