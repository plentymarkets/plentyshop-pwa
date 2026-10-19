describe('product page route', () => {
  it.each([
    ['/a-42', { sep: 'a-', itemId: '42' }],
    ['/shirt/a-42', { slug: ['shirt'], sep: '/a-', itemId: '42' }],
    ['/men/shirt/a-42', { slug: ['men', 'shirt'], sep: '/a-', itemId: '42' }],
    ['/shirt_42', { slug: ['shirt'], sep: '_', itemId: '42' }],
    ['/shirt_42_7', { slug: ['shirt'], sep: '_', itemId: '42_7' }],
  ])('should resolve %s to the product page', (path, params) => {
    const resolved = useRouter().resolve(path);

    expect(resolved.meta.type).toBe('product');
    expect(resolved.params).toEqual(params);
  });

  it.each(['/shirt-a-42', '/a-'])('should not resolve %s as a slugless product', (path) => {
    const resolved = useRouter().resolve(path);

    expect(resolved.params.sep).not.toBe('a-');
  });

  it.each(['/a-42', '/shirt/a-42', '/shirt_42_7'])(
    'should re-resolve %s by route name, as @nuxtjs/i18n does for localized links',
    (path) => {
      const router = useRouter();
      const resolved = router.resolve(path);
      const namedLocation = { name: resolved.name ?? undefined, params: resolved.params };

      expect(namedLocation.name).toBeDefined();
      expect(() => router.resolve(namedLocation)).not.toThrow();
      expect(decodeLocalizedPathSlashes(router.resolve(namedLocation).fullPath, path)).toBe(path);
    },
  );
});
