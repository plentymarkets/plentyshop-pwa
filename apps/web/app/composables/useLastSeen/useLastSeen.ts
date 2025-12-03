import { useLocalStorage } from '@vueuse/core';
import type { Product, FacetSearchCriteria, ApiError } from '@plentymarkets/shop-api';
import type { UseLastSeenState } from './types';

const STORAGE_KEY = 'plentyshop-last-seen';

/**
 * @description Composable for managing last seen products using local storage
 * @returns UseLastSeen composable interface
 * @example
 * ``` ts
 * const { data, loading, variationIds, addToLastSeen, fetchLastSeenProducts, clearLastSeen } = useLastSeen();
 * ```
 */
export const useLastSeen = () => {
  const config = useRuntimeConfig();
  const maxItems = Number(config.public.lastSeenMaxItems || 10);

  const state = useState<UseLastSeenState>('useLastSeen', () => ({
    data: [],
    loading: false,
    variationIds: [],
  }));

  const storedVariationIds = useLocalStorage<number[]>(STORAGE_KEY, []);

  if (state.value.variationIds.length === 0 && storedVariationIds.value.length > 0) {
    state.value.variationIds = storedVariationIds.value;
  }

  /**
   * @description Add a variation ID to the last seen list
   * @param variationId - The variation ID to add
   * @example
   * ``` ts
   * addToLastSeen(1234);
   * ```
   */
  const addToLastSeen = (variationId: number): void => {
    const filtered = state.value.variationIds.filter((id) => id !== variationId);
    
    const updated = [variationId, ...filtered];
    
    const limited = updated.slice(0, maxItems);
    
    state.value.variationIds = limited;
    storedVariationIds.value = limited;
  };

  /**
   * @description Fetch products for all stored variation IDs
   * @returns Promise<Product[]>
   * @example
   * ``` ts
   * const products = await fetchLastSeenProducts();
   * ```
   */
  const fetchLastSeenProducts = async () => {
    if (state.value.variationIds.length === 0) {
      state.value.data = [];
      return [];
    }

    state.value.loading = true;

    try {
      const params: FacetSearchCriteria = {
        itemIds: state.value.variationIds.join(','),
        itemsPerPage: maxItems,
      };

      const { data } = await useSdk().plentysystems.getFacet(params)
      const products = data?.products;
      
      const sortedProducts = state.value.variationIds
        .map((id) => products.find((p: Product) => p.variation.id === id))
        .filter((p): p is Product => p !== undefined);

      state.value.data = sortedProducts;
      state.value.loading = false;
      
      return sortedProducts;
    } catch (error) {
      useHandleError(error as ApiError);
    }
  };

  /**
   * @description Clear all last seen items
   * @example
   * ``` ts
   * clearLastSeen();
   * ```
   */
  const clearLastSeen = () => {
    state.value.variationIds = [];
    state.value.data = [];
    storedVariationIds.value = [];
  };

  return {
    addToLastSeen,
    fetchLastSeenProducts,
    clearLastSeen,
    ...toRefs(state.value),
  };
};
