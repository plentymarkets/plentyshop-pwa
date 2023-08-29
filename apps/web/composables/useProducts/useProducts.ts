import { FacetSearchCriteria } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import type { Facet } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { defaults } from '~/composables';
import { FetchProducts, UseProductsReturn, UseProductsState } from '~/composables/useProducts/types';
import { useSdk } from '~/sdk';

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
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
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

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value) data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;

    state.value.data = data.value?.data ?? state.value.data;
    state.value.data.facets = state.value.data.facets.filter((facet) => facet.id !== 'feedback');

    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProducts,
    ...toRefs(state.value),
  };
};
