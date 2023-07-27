import { FetchProducts, UseProductsReturn, UseProductsState } from '~/composables/useProducts/types';
import { sdk } from '~/sdk';
import { FacetSearchCriteria, Facet, ProductItemDocument, ProductItemDocumentData } from '../../../../../plentymarkets-sdk/packages/api-client';

const ITEMS_PER_PAGE = [20, 40, 100];

/**
 * @description Composable for managing products.
 * @returns {@link UseProducts}
 * @example
 * const { data, loading, fetchProducts } = useProducts();
 */
export const useProducts: UseProductsReturn = () => {
  const state = useState<UseProductsState>('products', () => ({
    data: null,
    loading: false,
  }));

  /**
   * @description Function for fetching products.
   * @example
   * getFacet(@props: FacetSearchCriteria)
   */
  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => sdk.plentysystems.getFacet(params));

    useHandleError(error.value);

    if (!data.value) {
      state.value.data = null;
      state.value.loading = false;
      return null;
    }

    const products: ProductItemDocumentData[] = data.value.data.itemList.documents.map(
      (document: ProductItemDocument) => document.data,
    );
    const facet: Facet = {
      category: data.value.data.category,
      products: products,
      facets: data.value.data.facets,
      languageUrls: data.value.data.urls,
      pagination: {
        perPageOptions: ITEMS_PER_PAGE,
        totals: products.length,
      },
      tree: {
        label: '',
        items: [],
        isCurrent: false,
      },
    };

    state.value.data = facet;
    state.value.loading = false;
    return facet;
  };

  return {
    fetchProducts,
    ...toRefs(state.value),
  };
};
