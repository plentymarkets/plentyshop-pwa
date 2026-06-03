import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Review } from '@plentymarkets/shop-api';
import { useStructuredData } from '../useStructuredData';
import { buildProduct, buildReviewWithCounts } from './fixtures';

const { mockUseHead } = vi.hoisted(() => ({ mockUseHead: vi.fn() }));
mockNuxtImport('useHead', () => mockUseHead);

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

describe('useStructuredData', () => {
  beforeEach(() => {
    mockUseHead.mockClear();
    reviewStateRef.value = {} as Review; // NOSONAR
    reviewAverageStateRef.value = {};
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
});
