import type {
  UseProductRecommendedReturn,
  UseProductRecommendedState,
  FetchProductRecommended,
} from '~/composables/useProductRecommended/types';
import type { FacetSearchCriteria, ApiError } from '@plentymarkets/shop-api';

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
   * @return FetchProductRecommended
   * @example
   * ``` ts
   * fetchProductRecommended('1');
   * ```
   * @param params
   */
  const fetchProductRecommended: FetchProductRecommended = async (params: FacetSearchCriteria) => {
    state.value.loading = true;

    const common = {
      itemsPerPage: 20,
      sort: 'sorting.price.avg_asc',
      type: params.type,
    };

    const payload = {
      ...common,
      itemId: params.itemId,
      crossSellingRelation: params.crossSellingRelation,
      categoryId: params.categoryId,
    };

    const wasCached = state.value.data.length > 0;
    // eslint-disable-next-line no-console
    console.log('🛒 useProductRecommended - fetchProductRecommended:', {
      categoryId: params.categoryId,
      payload,
      IS_CACHED: wasCached,
      currentDataLength: state.value.data.length,
    });

    try {
      const response = await useSdk().plentysystems.getFacet(payload);
      state.value.data = response?.data?.products ?? [];
      // eslint-disable-next-line no-console
      console.log('✅ useProductRecommended - fetch success:', {
        categoryId: params.categoryId,
        productsCount: state.value.data.length,
        WAS_CACHED_BEFORE_FETCH: wasCached,
      });
    } catch (error) {
      console.error('❌ useProductRecommended - fetch failed:', {
        categoryId: params.categoryId,
        payload,
        error,
      });
      useHandleError(error as ApiError);
      state.value.data = [];
    }

    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductRecommended,
    ...toRefs(state.value),
  };
};
