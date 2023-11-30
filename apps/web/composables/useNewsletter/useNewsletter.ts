import { NewsletterParams } from '@plentymarkets/shop-api';
import { UseNewsletterReturn, UseNewsletterState, Subscribe } from '~/composables/useNewsletter/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable for managing products search.
 * @returns UseSearchReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, getSearch } = useSearch();
 * ```
 */
export const useNewsletter: UseNewsletterReturn = () => {
  const state = useState<UseNewsletterState>('search', () => ({
    loading: false,
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
  const subscribe: Subscribe = async (params: NewsletterParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doSubscribeNewsletter(params));
    useHandleError(error.value);

    state.value.loading = false;
    return !!data.value?.data;
  };

  return {
    subscribe,
    ...toRefs(state.value),
  };
};
