import type { ReviewAverage } from '@plentymarkets/shop-api';
import { useSdk } from '~/sdk';
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
export const useProductReviewAverage: UseProductReviewAverage = (itemId: string) => {
  const state = useState<UseProductReviewAverageState>(`useProductReviewAverage-${itemId}`, () => ({
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

    try {
      const { data } = await useSdk().plentysystems.getReviewAverage({ itemId });

      state.value.data = data ?? state.value.data;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }

    return state.value.data;
  };

  return {
    fetchProductReviewAverage,
    ...toRefs(state.value),
  };
};
