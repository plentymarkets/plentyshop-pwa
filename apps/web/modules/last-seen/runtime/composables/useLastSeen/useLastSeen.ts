import type { ApiError, Product, ProductsByIdsResponse } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { useLocalStorage } from '@vueuse/core';

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
  const state = useState('useLastSeen', () => ({
    data: new Map<number, Product>(),
    loading: false,
    page: 1,
    itemsPerPage: 10,
    total: 0,
  }));

  const totalPages = ref();
  const storedVariationIds = useLocalStorage<number[]>(STORAGE_KEY, []);
  const itemsNotFetched = ref();

  watch(
    storedVariationIds,
    () => {
      itemsNotFetched.value = storedVariationIds.value.filter((id) => !state.value.data.has(id));
    },
    {
      immediate: true,
    },
  );

  /**
   * @description Add a variation ID to the last seen list
   * @param variationId - The variation ID to add
   * @example
   * ``` ts
   * addToLastSeen(1234);
   * ```
   */
  const addToLastSeen = (variationId: number): void => {
    if (storedVariationIds.value.includes(variationId)) {
      return;
    }
    storedVariationIds.value.unshift(variationId);
  };

  const handleLastSeenProducts = (data: ProductsByIdsResponse, appendData = false) => {
    const fetchedProducts = new Map();

    for (const product of data?.products ?? []) {
      fetchedProducts.set(Number(productGetters.getVariationId(product)), product);
    }
    if (appendData) {
      state.value.data = new Map([...state.value.data, ...fetchedProducts]);
    } else {
      state.value.data = new Map([...fetchedProducts, ...state.value.data]);
    }
    totalPages.value = Math.ceil((data?.total ?? 0) / state.value.itemsPerPage);
  };

  /**
   * @description Fetch products for all stored variation IDs
   * @returns Promise<Product[]>
   * @example
   * ``` ts
   * const products = await fetchLastSeenProducts();
   * ```
   */
  const fetchLastSeenProducts = async (itemsPerPage: number, appendData = false): Promise<void> => {
    if (storedVariationIds.value.length === 0 || itemsNotFetched.value.length <= 0) {
      return;
    }
    state.value.itemsPerPage = itemsPerPage;
    state.value.loading = true;

    try {
      const { data: products } = await useSdk().plentysystems.getProductsByIds({
        variationIds: itemsNotFetched.value,
        itemsPerPage: state.value.itemsPerPage,
        page: state.value.page,
      });

      handleLastSeenProducts(products, appendData);
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  const nextPage = () => {
    if (state.value.page < totalPages.value) {
      state.value.page++;
    }
  };

  const prevPage = () => {
    if (state.value.page > 1) {
      state.value.page--;
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
    state.value.data.clear();
    storedVariationIds.value = [];
  };

  return {
    nextPage,
    prevPage,
    addToLastSeen,
    fetchLastSeenProducts,
    clearLastSeen,
    ...toRefs(state.value),
    itemsNotFetched,
    storedVariationIds,
    totalPages,
  };
};
