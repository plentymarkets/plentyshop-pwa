import type { ItemSearchParams, ItemSearchResult } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';
import type { UseSearchReturn, UseSearchState, GetSearch } from '~/composables/useSearch/types';

/**
 * @description Composable for managing products search.
 * @returns UseSearchReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, getSearch } = useSearch();
 * ```
 */
export const useSearch: UseSearchReturn = () => {
  const state = useState<UseSearchState>('search', () => ({
    data: {} as ItemSearchResult,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
  }));

  /**
   * @description Function for searching products.
   * @param params { ItemSearchParams }
   * @return GetSearch
   * @example
   * ``` ts
   * getSearch({
   *   term: ''
   * })
   * ```
   */
  const getSearch: GetSearch = async (params: ItemSearchParams) => {
    state.value.loading = true;
    params.type = 'search';
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSearch(params));
    useHandleError(error.value);

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value) data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;

    state.value.data = data.value?.data ?? state.value.data;

    state.value.loading = false;
    return state.value.data;
  };

  const searchByTag = async (tagId: string, additionalParams: ItemSearchParams = {}) => {
    const params: ItemSearchParams = {
      ...additionalParams,
      type: 'tag',
      tagId: tagId,
    };

    return await getSearch(params);
  };

  return {
    getSearch,
    searchByTag,
    ...toRefs(state.value),
  };
};
