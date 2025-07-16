import type {
  UseProductRecommendedReturn,
  UseProductRecommendedState,
  FetchProductRecommended,
} from './types';

/**
 * Composable for managing recommended products data
 * @param categoryId Product slug
 * @return UseProductRecommendedReturn
 * @example
 * ``` ts
 * const { data, loading, fetchProductRecommended } = useProductRecommended('1');
 * ```
 */
export const useProductRecommended: UseProductRecommendedReturn = (categoryId: string) => {
  const state = useState<UseProductRecommendedState>(`useProductRecommended-${categoryId}`, () => ({
    data: [],
    loading: false,
  }));

  /** Function for fetching product recommended data
   * @param categoryId
   * @return FetchProductRecommended
   * @example
   * ``` ts
   * fetchProductRecommended('1');
   * ```
   */
  const fetchProductRecommended: FetchProductRecommended = async (categoryId: string) => {
    state.value.loading = true;
    const payload = {
      categoryId: categoryId,
      itemsPerPage: 20,
      sort: 'sorting.price.avg_asc',
    };

    const { data, error } = await useAsyncData(`useProductRecommended-${categoryId}`, () =>
      useSdk().plentysystems.getFacet(payload),
    );
    if (error.value) {
      useHandleError(error.value);
    }
    state.value.data = data?.value?.data?.products ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductRecommended,
    ...toRefs(state.value),
  };
};
