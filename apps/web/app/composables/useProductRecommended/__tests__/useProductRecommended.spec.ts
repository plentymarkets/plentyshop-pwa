import { useProductRecommended } from '~/composables/useProductRecommended/useProductRecommended';

describe('useProductRecommended', () => {
  it('should return product recommended', async () => {
    const slug = 'athletic-mens-walking-sneakers';
    const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(slug);

    await fetchProductRecommended({ type: 'category', categoryId: '16' });

    expect(recommendedProducts.value).not.toBeUndefined();
  });

  it('should request the last_seen facet with only the type argument', async () => {
    const { fetchProductRecommended } = useProductRecommended('last-seen-block');
    const getFacet = useSdk().plentysystems.getFacet;

    await fetchProductRecommended({ type: 'last_seen', categoryId: '16', itemId: '42' });

    const payload = vi.mocked(getFacet).mock.calls.at(-1)?.[0];
    expect(payload).toEqual({ type: 'last_seen' });
  });
});
