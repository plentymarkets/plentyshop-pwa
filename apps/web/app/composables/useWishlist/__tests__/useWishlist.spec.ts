import { useWishlist } from '../useWishlist';

describe('useWishlist', () => {
  it('should return wishlist', async () => {
    const { fetchWishlist, data } = useWishlist();

    await fetchWishlist();

    expect(data.value).not.toBeUndefined();
  });
});
