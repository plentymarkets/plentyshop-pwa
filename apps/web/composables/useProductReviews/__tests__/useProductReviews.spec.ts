import { vi } from 'vitest';
import { useProductReviews } from '~/composables/useProductReviews';
import { mockProductReviews } from './productReviews.mock';

vi.mock('~/sdk', () => ({
  sdk: {
    commerce: {
      getProductReviews: vi.fn(() => mockProductReviews),
    },
  },
}));

describe('useProductReview', () => {
  it('should return product reviews', async () => {
    const productId = '1100';
    const itemId = 1;
    const { data, fetchProductReviews } = useProductReviews(productId, itemId);

    await fetchProductReviews(productId, itemId);

    expect(data.value).toEqual(mockProductReviews);
  });
});
