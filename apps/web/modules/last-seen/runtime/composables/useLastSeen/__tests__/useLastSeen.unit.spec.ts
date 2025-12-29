import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLastSeen } from '../useLastSeen';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ProductFactory } from './ProductFactory';

describe('useLastSeen', () => {
  const { useSdk } = vi.hoisted(() => {
    return {
      useSdk: vi.fn().mockReturnValue({
        plentysystems: {
          getProductsByIds: vi.fn().mockImplementation(() => {
            return {
              data: [],
            };
          }),
        },
      }),
    };
  });

  mockNuxtImport('useSdk', () => {
    return useSdk;
  });

  beforeEach(() => {
    localStorage.clear();
    useLastSeen().clearLastSeen();
    vi.clearAllMocks();
  });

  it('should initialize with empty products array', () => {
    const { pages: products } = useLastSeen();
    expect(products.value).toEqual(new Map());
  });

  it('should add a variation ID to local storage', () => {
    const { addToLastSeen, localStorageVariationIds } = useLastSeen();
    addToLastSeen(ProductFactory.create(1234));
    expect(localStorageVariationIds.value).toContain(1234);
  });

  it('should add multiple variation IDs to local storage without duplicates', () => {
    const { addToLastSeen, localStorageVariationIds } = useLastSeen();
    addToLastSeen(ProductFactory.create(1234));
    addToLastSeen(ProductFactory.create(5678));
    addToLastSeen(ProductFactory.create(1234)); // duplicate
    expect(localStorageVariationIds.value).toEqual([5678, 1234]);
  });

  it('should add products to page 1', async () => {
    const { addToLastSeen, currentPageProducts } = useLastSeen();
    addToLastSeen(ProductFactory.create(1234));
    addToLastSeen(ProductFactory.create(4321));
    await nextTick();
    expect(currentPageProducts.value.length).toEqual(2);
  });

  it('should call SDK method to fetch products by IDs', async () => {
    const { fetchLastSeenProducts, localStorageVariationIds } = useLastSeen(2);
    localStorageVariationIds.value = [5678, 1234];

    await fetchLastSeenProducts();
    expect(useSdk().plentysystems.getProductsByIds).toHaveBeenCalledWith({
      variationIds: [5678, 1234],
      itemsPerPage: 2,
      page: 1,
    });
  });

  it('should add new products to a new page in data map', async () => {
    const product = ProductFactory.create(1234);
    const product2 = ProductFactory.create(4444);

    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getProductsByIds: vi.fn().mockImplementation(() => {
            return {
              data: {
                products: [product],
              },
            };
          }),
        },
      };
    });
    const { addToLastSeen, fetchLastSeenProducts, pages, nextPage, page } = useLastSeen(1);

    addToLastSeen(product);
    await fetchLastSeenProducts();

    addToLastSeen(product2);
    nextPage();

    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getProductsByIds: vi.fn().mockImplementation(() => {
            return {
              data: {
                products: [product2],
              },
            };
          }),
        },
      };
    });

    await fetchLastSeenProducts();

    expect(pages.value.size).toBe(1);
    expect(pages.value.get(1)![0]?.variation.id).toBe(product2.variation.id);
    expect(page.value).toBe(1);
  });

  it('should add fetched products to data map', async () => {
    const product = ProductFactory.create(1234);
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getProductsByIds: vi.fn().mockImplementation(() => {
            return {
              data: {
                products: [product],
              },
            };
          }),
        },
      };
    });
    const { addToLastSeen, fetchLastSeenProducts, pages } = useLastSeen();
    addToLastSeen(product);
    await fetchLastSeenProducts();
    expect(pages.value.size).toBe(1);
    const data = pages.value.get(1);
    expect(data![0]?.variation.id).toEqual(product.variation.id);
  });

  it('should clear last seen items', () => {
    const { addToLastSeen, clearLastSeen, pages, localStorageVariationIds } = useLastSeen();
    addToLastSeen(ProductFactory.create(1234));
    addToLastSeen(ProductFactory.create(5678));
    clearLastSeen();
    expect(localStorageVariationIds.value.length).toBe(0);
    expect(pages.value.size).toBe(0);
  });

  it('should paginate last seen products', async () => {
    const { addToLastSeen, fetchLastSeenProducts, nextPage, prevPage, page, itemsPerPage } = useLastSeen();
    for (let i = 1; i <= 25; i++) {
      addToLastSeen(ProductFactory.create(1000 + i));
    }

    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getProductsByIds: vi.fn().mockImplementation(() => {
            return {
              data: {
                products: [],
                total: 25,
              },
            };
          }),
        },
      };
    });
    await fetchLastSeenProducts();
    expect(page.value).toBe(1);
    expect(itemsPerPage.value).toBe(10);

    nextPage();
    expect(page.value).toBe(2);

    nextPage();
    expect(page.value).toBe(3);

    prevPage();
    expect(page.value).toBe(2);
  });
});
