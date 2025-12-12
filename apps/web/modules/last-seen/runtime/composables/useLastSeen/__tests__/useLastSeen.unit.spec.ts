import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLastSeen } from '../useLastSeen';
import { Product } from '@plentymarkets/shop-api';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ProductMock } from '../../../../../../__tests__/__mocks__/product.mock';

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
    const { data: products } = useLastSeen();
    expect(products.value).toEqual(new Map());
  });

  it('should add a variation ID to local storage', () => {
    const { addToLastSeen, storedVariationIds } = useLastSeen();
    addToLastSeen(1234);
    expect(storedVariationIds.value).toContain(1234);
  });

  it('should add multiple variation IDs to local storage without duplicates', () => {
    const { addToLastSeen, storedVariationIds } = useLastSeen();
    addToLastSeen(1234);
    addToLastSeen(5678);
    addToLastSeen(1234); // duplicate
    expect(storedVariationIds.value).toEqual([5678, 1234]);
  });

  it('should add variation Ids to not fetched items', async () => {
    const { addToLastSeen, itemsNotFetched } = useLastSeen();
    addToLastSeen(1234);
    addToLastSeen(4321);
    await nextTick();
    expect(itemsNotFetched.value).toEqual([4321, 1234]);
  });

  it('should not add variation Ids to not fetched items if already fetched', async () => {
    const { addToLastSeen, data, itemsNotFetched } = useLastSeen();
    data.value.set(1234, {} as Product);
    addToLastSeen(1234);
    addToLastSeen(5678);
    expect(itemsNotFetched.value).toEqual([5678]);
  });

  it('should call SDK method to fetch products by IDs', async () => {
    const { addToLastSeen, fetchLastSeenProducts } = useLastSeen();
    addToLastSeen(1234);
    addToLastSeen(5678);
    await fetchLastSeenProducts(10);
    expect(useSdk().plentysystems.getProductsByIds).toHaveBeenCalledWith({
      variationIds: [5678, 1234],
      itemsPerPage: 10,
      page: 1,
    });
  });

  it('should add fetched products to data map', async () => {
    const product = { ...ProductMock, variation: { ...ProductMock.variation, id: 1234 } };
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
    const { addToLastSeen, fetchLastSeenProducts, data } = useLastSeen();
    addToLastSeen(1234);
    await fetchLastSeenProducts(10);
    expect(data.value.size).toBe(1);
    expect(data.value.has(1234)).toBe(true);
    expect(data.value.get(product.variation.id)).toEqual(product);
  });

  it('should clear last seen items', () => {
    const { addToLastSeen, clearLastSeen, data, storedVariationIds } = useLastSeen();
    addToLastSeen(1234);
    addToLastSeen(5678);
    clearLastSeen();
    expect(storedVariationIds.value.length).toBe(0);
    expect(data.value.size).toBe(0);
  });

  it('should paginate last seen products', async () => {
    const { addToLastSeen, fetchLastSeenProducts, nextPage, prevPage, page, itemsPerPage } = useLastSeen();
    for (let i = 1; i <= 25; i++) {
      addToLastSeen(1000 + i);
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
    await fetchLastSeenProducts(10);
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
