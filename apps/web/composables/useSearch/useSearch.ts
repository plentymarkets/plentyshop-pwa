import { ItemSearchParams, ItemSearchResult } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';
import { UseSearchReturn, UseSearchState, GetSearch } from '~/composables/useSearch/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable for managing products search.
 * @returns {@link UseSearchReturn}
 * @example
 * const { data, loading, getSearch } = useSearch();
 */
export const useSearch: UseSearchReturn = () => {
  const state = useState<UseSearchState>('search', () => ({
    data: {} as ItemSearchResult,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
  }));

  /**
   * @description Function for searching products.
   * @example
   * getSearch(@props: ItemSearchParams)
   */
  const getSearch: GetSearch = async (params: ItemSearchParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSearch(params));
    useHandleError(error.value);

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value) data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;

    state.value.data = data.value?.data ?? state.value.data;

    state.value.loading = false;
    return state.value.data;
  };

  return {
    getSearch,
    ...toRefs(state.value),
  };
};
