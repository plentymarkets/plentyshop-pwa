import { useProductReviews } from '~/composables/useProductReviews';

describe('useProductReview', () => {
  it('should return product reviews', async () => {
    const itemId = 109;
    const { data, fetchProductReviews } = useProductReviews(itemId);

    await fetchProductReviews(itemId);

    expect(data.value).not.toBeUndefined();
  });
});
