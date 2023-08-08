import { FacetSearchCriteria } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { Facet } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { FetchProducts, UseProductsReturn, UseProductsState } from '~/composables/useProducts/types';
import { useSdk } from '~/sdk';

const PER_PAGE_STEPS = [10, 20, 50, 100];
const DEFAULT_ITEMS_PER_PAGE = '50';

/**
 * @description Composable for managing products.
 * @returns {@link UseProducts}
 * @example
 * const { data, loading, fetchProducts } = useProducts();
 */
export const useProducts: UseProductsReturn = () => {
  const state = useState<UseProductsState>('products', () => ({
    data: {} as Facet,
    loading: false,
  }));

  /**
   * @description Function for fetching products.
   * @example
   * getFacet(@props: FacetSearchCriteria)
   */
  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getFacet(params));
    useHandleError(error.value);

    if (data.value) data.value.data.pagination.perPageOptions = PER_PAGE_STEPS;

    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    PER_PAGE_STEPS,
    DEFAULT_ITEMS_PER_PAGE,
    fetchProducts,
    ...toRefs(state.value),
  };
};
