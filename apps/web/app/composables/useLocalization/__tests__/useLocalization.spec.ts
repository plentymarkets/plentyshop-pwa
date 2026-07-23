import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { i18nHolder, useUrlTrailingSlash, localePathMock } = vi.hoisted(() => ({
  i18nHolder: { current: {} as Record<string, unknown> },
  useUrlTrailingSlash: vi.fn(),
  localePathMock: vi.fn(),
}));

mockNuxtImport('useNuxtApp', () => () => {
  const app = tryUseNuxtApp();
  if (!app) return { $i18n: i18nHolder.current } as never;
  return new Proxy(app, {
    get: (target, prop) => (prop === '$i18n' ? i18nHolder.current : Reflect.get(target, prop)),
  }) as never;
});
mockNuxtImport('useUrlTrailingSlash', () => useUrlTrailingSlash);
mockNuxtImport('useLocalePath', () => () => localePathMock);

const setI18n = (i18n: Record<string, unknown>) => {
  i18nHolder.current = i18n;
};

describe('useLocalization', () => {
  beforeEach(() => {
    vi.resetModules();

    localePathMock.mockImplementation((path: string) => path);

    useUrlTrailingSlash.mockImplementation(() => ({
      resolvePathTrailingSlash: (path: string) => (path.endsWith('/') ? path : `${path}/`),
      applyToUrl: (url: string) => url,
    }));

    setI18n({
        locale: ref('de'),
        defaultLocale: 'en',
        strategy: 'prefix_and_default',
        locales: ref([{ code: 'de' }, { code: 'en' }]),
      });
  });

  it('should get url without language prefix for prefix_and_default strategy', async () => {
    const { useLocalization } = await import('../useLocalization');

    const { getCategoryUrlFromRoute } = useLocalization();

    expect(getCategoryUrlFromRoute('/de/category/subcategory')).toBe('/category/subcategory');
  });

  it('should test strategy "prefix_except_default"', async () => {
    setI18n({
        locale: ref('de'),
        defaultLocale: 'de',
        strategy: 'prefix_except_default',
        locales: ref([]),
      });

    const { useLocalization } = await import('../useLocalization');

    const { getCategoryUrlFromRoute } = useLocalization();

    expect(getCategoryUrlFromRoute('/category/subcategory')).toBe('/category/subcategory');
  });

  it('should test strategy "prefix"', async () => {
    setI18n({
        locale: ref('en'),
        defaultLocale: 'de',
        strategy: 'prefix',
        locales: ref([]),
      });

    const { useLocalization } = await import('../useLocalization');

    const { getCategoryUrlFromRoute } = useLocalization();

    expect(getCategoryUrlFromRoute('/en/category/subcategory')).toBe('/category/subcategory');
  });

  it('should apply localization and trailing slash', async () => {
    const localePath = useLocalizedPath();

    expect(localePath('/product')).toBe('/product/');
    expect(localePath('/product-name_123')).toBe('/product-name_123/');
  });
});
