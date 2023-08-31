import { ReviewAverage } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import { FetchProductReviewAverage, UseProductReviewAverage, UseProductReviewAverageState } from './types';

/**
 * @description Composable managing review average data
 * @returns {@link UseProductReviewsAverageReturn}
 * @example
 * const { data, loading, fetchProductReviewAverage } = useProductReviewAverage(itemId);
 * @param itemId
 */
export const useProductReviewAverage: UseProductReviewAverage = (itemId: string) => {
  const state = useState<UseProductReviewAverageState>(`useProductReviewAverage-${itemId}`, () => ({
    data: {} as ReviewAverage,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @example
   * fetchProductReviewAverage(itemId);
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
