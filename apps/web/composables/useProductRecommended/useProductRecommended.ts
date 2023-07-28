import { toRefs } from '@vueuse/shared';
import type {
  UseProductRecommendedReturn,
  UseProductRecommendedState,
  FetchProductRecommended,
} from '~/composables/useProductRecommended/types';
import { sdk } from '~/sdk';

/**
 * Composable for getting recommended products data
 * @param {string} slug Product slug
 */
export const useProductRecommended: UseProductRecommendedReturn = (slug) => {
  const state = useState<UseProductRecommendedState>(`useProductRecommended-${slug}`, () => ({
    data: null,
    loading: false,
  }));

  /** Function for fetching product recommended data
   * @param {string} slug Product slug
   * @example
   * fetchProductRecommended('product-slug');
   */
  const fetchProductRecommended: FetchProductRecommended = async (slug) => {
    state.value.loading = true;
    // this is temporary because we don't have endpoint for recommanded so we should use (get all products from a category util we have endpoint)
    const payload = {
      categoryId: '17',
      categorySlug: "armchair-stool",
      page: 1,
      itemsPerPage: 20,
      sort: 'sorting.price.avg_asc',
      facets: 'feedback-2'
    }
    const { data, error } = await useAsyncData(() => sdk.plentysystems.getFacet(payload));
    useHandleError(error.value);
    state.value.data = data.value?.data.itemList?.documents;
    state.value.loading = false;
    return data;
  };

  return {
    fetchProductRecommended,
    ...toRefs(state.value),
  };
};
