import type { ApiError, Product, ProductsByIdsResponse } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { useLocalStorage } from '@vueuse/core';

const STORAGE_KEY = 'plentyshop-last-seen';

/**
 * @description Composable for managing last seen products using local storage
 */
export const useLastSeen = (itemsPerPage = 10) => {
  const state = useState('useLastSeen', () => ({
    pages: new Map<number, Product[]>(),
    loading: false,
    page: 1,
    itemsPerPage: itemsPerPage,
    total: 0,
  }));

  const storedVariationIds = useLocalStorage<number[]>(STORAGE_KEY, []);

  const createPages = (storedVariationIds: number[]) => {
    const totalItems = storedVariationIds.length;
    const totalPages = Math.ceil(totalItems / state.value.itemsPerPage);
    const pagesArray = new Array(totalPages);

    for (let i = 0; i < totalPages; i++) {
      const start = i * state.value.itemsPerPage;
      pagesArray[i] = storedVariationIds.slice(start, start + state.value.itemsPerPage);
    }

    return pagesArray;
  };

  const pageIds = computed(() => createPages(storedVariationIds.value));

  const totalPages = computed(() => pageIds.value.length);

  const currentPageIds = computed(() => {
    const pageIndex = state.value.page - 1;
    return pageIds.value[pageIndex] ?? [];
  });


  const currentPageProducts = computed(() => {
    return state.value.pages.get(state.value.page) ?? [];
  });

  const needsToFetch = computed(() => {
    const pageProducts = state.value.pages.get(state.value.page);
    return !pageProducts || pageProducts.length === 0;
  });

  /**
   * @description Add a product to the last seen list
   * @param product - The product to add
   * @example
   * ``` ts
   * addToLastSeen(product);
   * ```
   */
  const addToLastSeen = (product: Product): void => {
    const variationId = Number(productGetters.getVariationId(product));
    
    if (storedVariationIds.value.includes(variationId)) {
      return;
    }
    
    storedVariationIds.value.unshift(variationId);
    state.value.total = storedVariationIds.value.length;
    
    const currentNewProducts = state.value.pages.get(1) ?? [];
    state.value.pages.set(1, [product, ...currentNewProducts]);
  };

  const handleLastSeenProducts = (data: ProductsByIdsResponse) => {
    const fetchedProducts: Product[] = data?.products ?? [];
    
    if (fetchedProducts.length > 0) {
      state.value.pages.set(state.value.page, fetchedProducts);
    }
    
    state.value.total = storedVariationIds.value.length;
  };

  /**
   * @description Fetch products for the current page
   * @returns Promise<void>
   * @example
   * ``` ts
   * await fetchLastSeenProducts();
   * ```
   */
  const fetchLastSeenProducts = async (): Promise<void> => {
    if (storedVariationIds.value.length === 0 || !needsToFetch.value) {
      return;
    }
    state.value.loading = true;

    try {
      const { data: products } = await useSdk().plentysystems.getProductsByIds({
        variationIds: currentPageIds.value,
        itemsPerPage: currentPageIds.value.length,
        page: 1,
      });

      handleLastSeenProducts(products);
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
    state.value.pages.clear();
    storedVariationIds.value = [];
    state.value.page = 1;
    state.value.total = 0;
  };

  return {
    nextPage,
    prevPage,
    addToLastSeen,
    fetchLastSeenProducts,
    clearLastSeen,
    ...toRefs(state.value),
    storedVariationIds,
    totalPages,
    currentPageProducts,
    needsToFetch,
  };
};
