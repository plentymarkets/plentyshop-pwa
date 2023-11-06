import { vi } from 'vitest';
import { useProductReviews } from '~/composables/useProductReviews';
import { mockProductReviews } from './productReviews.mock';

vi.mock('~/sdk', () => ({
  useSdk: () => ({
    commerce: {
      getProductReviews: vi.fn(() => mockProductReviews),
    },
  }),
}));

describe('useProductReview', () => {
  it('should return product reviews', async () => {
    // const productId = '1100';
    const itemId = 1;
    const { data, fetchProductReviews } = useProductReviews(itemId);

    await fetchProductReviews(itemId);

    expect(data.value).toEqual(mockProductReviews);
  });
});
