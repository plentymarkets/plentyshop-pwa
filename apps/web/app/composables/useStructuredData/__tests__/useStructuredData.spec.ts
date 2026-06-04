import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { productGetters } from '@plentymarkets/shop-api';
import type { Review } from '@plentymarkets/shop-api';
import { useStructuredData } from '../useStructuredData';
import {
  buildProduct,
  buildProductWithItemId,
  buildProductWithVariationId,
  buildProductWithUrlPath,
  buildReviewWithCounts,
} from './fixtures';

const { mockUseHead } = vi.hoisted(() => ({ mockUseHead: vi.fn() }));
mockNuxtImport('useHead', () => mockUseHead);

const runtimeConfigRef = { public: { domain: 'https://shop.example.com' } };
const { useRuntimeConfigMock } = vi.hoisted(() => ({
  useRuntimeConfigMock: vi.fn(() => runtimeConfigRef),
}));
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfigMock);

const routeRef = { fullPath: '/search?term=test' };
const { useRouteMock } = vi.hoisted(() => ({ useRouteMock: vi.fn(() => routeRef) }));
mockNuxtImport('useRoute', () => useRouteMock);

const { useLocalePathMock } = vi.hoisted(() => ({
  useLocalePathMock: vi.fn(() => (path: string) => path),
}));
mockNuxtImport('useLocalePath', () => useLocalePathMock);

const isSingleProductUrlSchemeEnabled = ref(false);
const { useCallistoMock } = vi.hoisted(() => ({
  useCallistoMock: vi.fn(() => ({ isEnabled: isSingleProductUrlSchemeEnabled.value })),
}));
mockNuxtImport('useCallisto', () => useCallistoMock);

const mockProductPrice = { price: ref(10), crossedPrice: ref(0) };
const { useProductPrice } = vi.hoisted(() => ({ useProductPrice: vi.fn(() => mockProductPrice) }));
mockNuxtImport('useProductPrice', () => useProductPrice);

const reviewStateRef = ref({} as unknown as Review); // NOSONAR
const { useProductReviews } = vi.hoisted(() => ({
  useProductReviews: vi.fn(() => ({ data: reviewStateRef })),
}));
mockNuxtImport('useProductReviews', () => useProductReviews);

const reviewAverageStateRef = ref({});
const { useProductReviewAverage } = vi.hoisted(() => ({
  useProductReviewAverage: vi.fn(() => ({ data: reviewAverageStateRef })),
}));
mockNuxtImport('useProductReviewAverage', () => useProductReviewAverage);

const getCapturedJsonLd = (): Record<string, unknown> => {
  const calls = mockUseHead.mock.calls;
  for (let i = calls.length - 1; i >= 0; i--) {
    const call = calls[i];
    if (!call) continue;
    const arg = call[0] as { script?: { type: string; innerHTML: string }[] };
    const script = arg?.script?.find((s) => s.type === 'application/ld+json');
    if (script) return JSON.parse(script.innerHTML) as Record<string, unknown>;
  }
  return {};
};

const getCapturedJsonLdRaw = (): string => {
  const calls = mockUseHead.mock.calls;

  for (let i = calls.length - 1; i >= 0; i--) {
    const call = calls[i];
    if (!call) continue;

    const arg = call[0] as { script?: { type: string; innerHTML: string }[] };
    const script = arg?.script?.find((s) => s.type === 'application/ld+json');

    if (script) return script.innerHTML;
  }

  return '';
};

describe('useStructuredData', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    mockUseHead.mockClear();
    reviewStateRef.value = {} as Review; // NOSONAR
    reviewAverageStateRef.value = {};
    routeRef.fullPath = '/search?term=test';
    runtimeConfigRef.public.domain = 'https://shop.example.com';
    isSingleProductUrlSchemeEnabled.value = false;
  });

  describe('setProductMetaData — aggregateRating', () => {
    it('should omit aggregateRating when reviewCount is 0', () => {
      reviewStateRef.value = buildReviewWithCounts(0, '0.00');

      const { setProductMetaData } = useStructuredData();
      setProductMetaData(buildProduct());

      const jsonLd = getCapturedJsonLd();
      expect(jsonLd['aggregateRating']).toBeUndefined();
    });

    it('should include aggregateRating when reviewCount > 0', () => {
      reviewStateRef.value = buildReviewWithCounts(3, '4.50');

      const { setProductMetaData } = useStructuredData();
      setProductMetaData(buildProduct());

      const jsonLd = getCapturedJsonLd();
      expect(jsonLd['aggregateRating']).toBeDefined();
    });

    it('should use review counts for ratingValue, not product.item.feedbackDecimal', () => {
      reviewStateRef.value = buildReviewWithCounts(3, '4.50');

      const { setProductMetaData } = useStructuredData();
      setProductMetaData(buildProduct());

      const jsonLd = getCapturedJsonLd();
      const aggregateRating = jsonLd['aggregateRating'] as Record<string, unknown>;
      expect(aggregateRating['ratingValue']).toBe(4.5);
    });

    it('should use review counts for reviewCount, not product.item.feedbackCount', () => {
      reviewStateRef.value = buildReviewWithCounts(3, '4.50');

      const { setProductMetaData } = useStructuredData();
      setProductMetaData(buildProduct());

      const jsonLd = getCapturedJsonLd();
      const aggregateRating = jsonLd['aggregateRating'] as Record<string, unknown>;
      expect(aggregateRating['reviewCount']).toBe(3);
    });

    it('should have correct schema type on aggregateRating', () => {
      reviewStateRef.value = buildReviewWithCounts(1, '5.00');

      const { setProductMetaData } = useStructuredData();
      setProductMetaData(buildProduct());

      const jsonLd = getCapturedJsonLd();
      const aggregateRating = jsonLd['aggregateRating'] as Record<string, unknown>;
      expect(aggregateRating['@type']).toBe('AggregateRating');
    });
  });

  describe('setItemListMetaData', () => {
    it('should generate ItemList JSON-LD with product list URLs', () => {
      const productWithItemId = buildProductWithItemId(2);
      const secondProduct = {
        ...productWithItemId,
        variation: {
          ...productWithItemId.variation,
          id: 202,
        },
      };

      const { setItemListMetaData } = useStructuredData();
      setItemListMetaData([buildProduct(), secondProduct]);

      const jsonLd = getCapturedJsonLd();

      expect(jsonLd['@type']).toBe('ItemList');
      expect(jsonLd['numberOfItems']).toBe(2);
      expect(jsonLd['url']).toBe('https://shop.example.com/search?term=test');

      const itemListElement = jsonLd['itemListElement'] as Array<Record<string, unknown>>;
      expect(itemListElement[0]?.url).toBe('https://shop.example.com/test-product_1');
      expect(itemListElement[1]?.url).toBe('https://shop.example.com/test-product_2');
    });

    it('should generate single-product-url-scheme links when enabled', () => {
      isSingleProductUrlSchemeEnabled.value = true;

      const { setItemListMetaData } = useStructuredData();
      setItemListMetaData([buildProduct()]);

      const jsonLd = getCapturedJsonLd();
      const itemListElement = jsonLd['itemListElement'] as Array<Record<string, unknown>>;

      expect(itemListElement[0]?.url).toBe('https://shop.example.com/test-product/a-1');
    });

    it('should generate an empty ItemList when products are empty', () => {
      const { setItemListMetaData } = useStructuredData();
      setItemListMetaData([]);

      const jsonLd = getCapturedJsonLd();

      expect(jsonLd['@type']).toBe('ItemList');
      expect(jsonLd['numberOfItems']).toBe(0);
      expect(jsonLd['itemListElement']).toEqual([]);
    });

    it('should skip products missing itemId or urlPath', () => {
      const missingItemIdProduct = buildProductWithItemId(1);
      const missingPathProduct = buildProductWithUrlPath('');
      vi.spyOn(productGetters, 'getItemId').mockReturnValueOnce('').mockReturnValueOnce('3');
      vi.spyOn(productGetters, 'getUrlPath').mockReturnValueOnce('test-product').mockReturnValueOnce('');

      const { setItemListMetaData } = useStructuredData();
      setItemListMetaData([missingItemIdProduct, missingPathProduct]);

      const jsonLd = getCapturedJsonLd();

      expect(jsonLd['numberOfItems']).toBe(0);
      expect(jsonLd['itemListElement']).toEqual([]);
    });

    it('should preserve original index positions for valid products after filtering invalid ones', () => {
      vi.spyOn(productGetters, 'getItemId').mockReturnValueOnce('1').mockReturnValueOnce('').mockReturnValueOnce('2');

      const { setItemListMetaData } = useStructuredData();
      setItemListMetaData([buildProduct(), buildProductWithItemId(11), buildProductWithVariationId(2)]);

      const jsonLd = getCapturedJsonLd();
      const itemListElement = jsonLd['itemListElement'] as Array<Record<string, unknown>>;

      expect(jsonLd['numberOfItems']).toBe(2);
      expect(itemListElement[0]?.position).toBe(1);
      expect(itemListElement[1]?.position).toBe(3);
      expect(itemListElement[0]?.url).toBe('https://shop.example.com/test-product_1');
      expect(itemListElement[1]?.url).toBe('https://shop.example.com/test-product_2');
    });

    it('should escape unsafe characters in JSON-LD innerHTML', () => {
      vi.spyOn(productGetters, 'getName').mockReturnValue('</script><img src=x onerror=alert(1)>');

      const { setItemListMetaData } = useStructuredData();
      setItemListMetaData([buildProduct()]);

      const rawJsonLd = getCapturedJsonLdRaw();
      expect(rawJsonLd).not.toContain('</script>');
      expect(rawJsonLd).toContain(String.raw`\u003C/script>`);
    });
  });
});
