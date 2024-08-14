import type { FacetSearchCriteria, Product } from '@plentymarkets/shop-api';
import type { Facet } from '@plentymarkets/shop-api';
import { defaults, type SetCurrentProduct } from '~/composables';
import type { FetchProducts, UseProductsReturn, UseProductsState } from '~/composables/useProducts/types';

/**
 * @description Composable for managing products.
 * @returns UseProductsReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, selectedVariation, fetchProducts, selectVariation } = useProducts();
 * ```
 */
export const useProducts: UseProductsReturn = () => {
  const state = useState<UseProductsState>('useProducts', () => ({
    data: {} as Facet,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
    currentProduct: {} as Product,
  }));

  /**
   * @description Function for fetching products.
   * @param params { FacetSearchCriteria }
   * @return FetchProducts
   * @example
   * ``` ts
   *  fetchProducts({
   *     page: 1,
   *     categoryUrlPath: '/living-room'
   *  });
   * ```
   */
  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    state.value.loading = true;
    const { data } = await useAsyncData(() => useSdk().plentysystems.getFacet(params));

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value) data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;

    state.value.data = data.value?.data ?? state.value.data;

    if (state.value.data?.facets?.length) {
      state.value.data.facets = state.value.data.facets.filter((facet) => facet.id !== 'feedback');
    }

    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for setting the current product.
   * @param product { Product }
   * @return SetCurrentProduct
   * @example
   * ``` ts
   *  setCurrentProduct({} as Product)
   * ```
   */
  const setCurrentProduct: SetCurrentProduct = async (product: Product) => {
    state.value.loading = true;

    state.value.currentProduct = product;

    state.value.loading = false;
  };

  return {
    fetchProducts,
    setCurrentProduct,
    ...toRefs(state.value),
  };
};
