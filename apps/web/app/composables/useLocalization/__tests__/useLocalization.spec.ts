import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useNuxtApp, useUrlTrailingSlash, localePathMock } = vi.hoisted(() => ({
  useNuxtApp: vi.fn(),
  useUrlTrailingSlash: vi.fn(),
  localePathMock: vi.fn(),
}));

mockNuxtImport('useNuxtApp', () => useNuxtApp);
mockNuxtImport('useUrlTrailingSlash', () => useUrlTrailingSlash);
mockNuxtImport('useLocalePath', () => () => localePathMock);

describe('useLocalization', () => {
  beforeEach(() => {
    vi.resetModules();

    localePathMock.mockImplementation((path: string) => path);

    useUrlTrailingSlash.mockImplementation(() => ({
      resolvePathTrailingSlash: (path: string) => (path.endsWith('/') ? path : `${path}/`),
      applyToUrl: (url: string) => url,
    }));

    useNuxtApp.mockImplementation(() => ({
      $i18n: {
        locale: ref('de'),
        defaultLocale: 'en',
        strategy: 'prefix_and_default',
        locales: ref([{ code: 'de' }, { code: 'en' }]),
      },
    }));
  });

  it('should get url without language prefix for prefix_and_default strategy', async () => {
    const { useLocalization } = await import('../useLocalization');

    const { getCategoryUrlFromRoute } = useLocalization();

    expect(getCategoryUrlFromRoute('/de/category/subcategory')).toBe('/category/subcategory');
  });

  it('should test strategy "prefix_except_default"', async () => {
    useNuxtApp.mockImplementation(() => ({
      $i18n: {
        locale: ref('de'),
        defaultLocale: 'de',
        strategy: 'prefix_except_default',
        locales: ref([]),
      },
    }));

    const { useLocalization } = await import('../useLocalization');

    const { getCategoryUrlFromRoute } = useLocalization();

    expect(getCategoryUrlFromRoute('/category/subcategory')).toBe('/category/subcategory');
  });

  it('should test strategy "prefix"', async () => {
    useNuxtApp.mockImplementation(() => ({
      $i18n: {
        locale: ref('en'),
        defaultLocale: 'de',
        strategy: 'prefix',
        locales: ref([]),
      },
    }));

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
