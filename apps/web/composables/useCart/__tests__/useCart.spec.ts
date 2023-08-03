import { useCart } from '~/composables/useCart/useCart';

describe('useCart', () => {
  it('should return account data', async () => {
    const { getCart, data } = useCart();

    await getCart();

    expect(data.value).not.toBeUndefined();
  });
});
