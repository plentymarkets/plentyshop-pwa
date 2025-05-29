import { mockNuxtImport } from '@nuxt/test-utils/runtime';

describe('useLocalization', () => {
  const { useNuxtApp } = vi.hoisted(() => {
    return {
      useNuxtApp: vi.fn().mockImplementation(() => {
        return {
          $i18n: {
            locale: ref('de'),
            defaultLocale: 'en',
            strategy: 'prefix_and_default',
          },
        };
      }),
    };
  });

  mockNuxtImport('useNuxtApp', () => {
    return useNuxtApp;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should get url without language prefix default strategy', async () => {
    const { getCategoryUrlFromRoute } = useLocalization();
    const res = getCategoryUrlFromRoute('/de/category/subcategory');
    expect(res).toBe('/category/subcategory');
  });

  it('should test strategy "prefix_except_default"', () => {
    useNuxtApp.mockImplementation(() => {
      return {
        $i18n: {
          locale: ref('de'),
          defaultLocale: 'de',
          strategy: 'prefix_except_default',
        },
      };
    });
    const path = '/category/subcategory';

    const { getCategoryUrlFromRoute } = useLocalization();
    const res = getCategoryUrlFromRoute(path);
    expect(res).toBe('/category/subcategory');
  });

  it('should test strategy "prefix"', () => {
    useNuxtApp.mockImplementation(() => {
      return {
        $i18n: {
          locale: ref('en'),
          defaultLocale: 'de',
          strategy: 'prefix',
        },
      };
    });

    const path = '/en/category/subcategory';

    const { getCategoryUrlFromRoute } = useLocalization();
    const res = getCategoryUrlFromRoute(path);
    expect(res).toBe('/category/subcategory');
  });
});
