import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { categoryGetters } from '@plentymarkets/shop-api';
import type { Category, Facet, FacetSearchCriteria } from '@plentymarkets/shop-api';
import { useUrlPageMeta } from '../useUrlPageMeta';

const { mockUseHead } = vi.hoisted(() => ({ mockUseHead: vi.fn() }));
mockNuxtImport('useHead', () => mockUseHead);

const { mockUseSeoMeta } = vi.hoisted(() => ({ mockUseSeoMeta: vi.fn() }));
mockNuxtImport('useSeoMeta', () => mockUseSeoMeta);

const runtimeConfigRef = { app: { baseURL: '/' }, public: { domain: 'https://shop.example.com' } };
const { useRuntimeConfigMock } = vi.hoisted(() => ({
  useRuntimeConfigMock: vi.fn(() => runtimeConfigRef),
}));
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfigMock);

const navigateToRoute = async (path: string) => {
  await useRouter().push(path);
};

const { localePathMock } = vi.hoisted(() => ({
  localePathMock: vi.fn((path: string, locale?: string) => (locale && locale !== 'en' ? `/${locale}${path}` : path)),
}));
mockNuxtImport('useLocalePath', () => () => localePathMock);

const { applyTrailingSlashMock } = vi.hoisted(() => ({
  applyTrailingSlashMock: vi.fn((url: string) => url),
}));
mockNuxtImport('useUrlTrailingSlash', () => () => ({ applyToUrl: applyTrailingSlashMock }));

const availableLocales = ['en', 'de'];
const { getAvailableLocalesMock } = vi.hoisted(() => ({
  getAvailableLocalesMock: vi.fn(() => availableLocales),
}));
mockNuxtImport('useLocalization', () => () => ({ getAvailableLocales: getAvailableLocalesMock }));

const maxIndexedPage = { value: 1 };
const { getNumberSettingMock } = vi.hoisted(() => ({ getNumberSettingMock: vi.fn() }));
mockNuxtImport('useSiteSettings', () => () => ({ getNumberSetting: getNumberSettingMock }));

const i18nHolder = { current: { defaultLocale: 'en', locale: ref('en') } as Record<string, unknown> };
mockNuxtImport('useNuxtApp', () => () => {
  const app = tryUseNuxtApp();
  if (!app) {
    return { $i18n: i18nHolder.current } as never;
  }
  return new Proxy(app, {
    get: (target, prop) => (prop === '$i18n' ? i18nHolder.current : Reflect.get(target, prop)),
  }) as never;
});

const buildCategory = (overrides: Partial<Category> = {}): Category => ({ id: 1, ...overrides }) as Category;

const buildFacet = (overrides: Partial<Facet> = {}): Facet =>
  ({
    category: buildCategory(),
    facets: [],
    products: [],
    languageUrls: { 'x-default': '/category', en: '/category', de: '/kategorie' },
    pagination: { totals: 0, perPageOptions: [] },
    ...overrides,
  }) as Facet;

type CapturedLink = { rel: string; hreflang?: string; href: string };

const isCanonicalLink = (link: CapturedLink): boolean => link.rel === 'canonical';
const isAlternateLink = (link: CapturedLink): boolean => link.rel === 'alternate';
const hasHreflang =
  (hreflang: string) =>
  (link: CapturedLink): boolean =>
    link.hreflang === hreflang;

const getCapturedLinks = (): CapturedLink[] => {
  const calls = mockUseHead.mock.calls;

  for (let i = calls.length - 1; i >= 0; i--) {
    const arg = calls[i]?.[0] as { link?: CapturedLink[] };

    if (arg?.link?.some(isCanonicalLink)) {
      return arg.link;
    }
  }

  return [];
};

describe('useUrlPageMeta', () => {
  beforeEach(async () => {
    mockUseHead.mockClear();
    mockUseSeoMeta.mockClear();
    localePathMock.mockClear();
    applyTrailingSlashMock.mockClear();
    getNumberSettingMock.mockReset();
    getNumberSettingMock.mockImplementation((fallback: number) => maxIndexedPage.value || fallback);
    await navigateToRoute('/category');
    i18nHolder.current = { defaultLocale: 'en', locale: ref('en') };
  });

  describe('setStaticPageMeta', () => {
    it('should set the canonical link to the current localized route', () => {
      const { setStaticPageMeta } = useUrlPageMeta();
      setStaticPageMeta();

      const links = getCapturedLinks();
      expect(links.find(isCanonicalLink)?.href).toBe('https://shop.example.com/category');
    });

    it('should set ogUrl to the canonical link', () => {
      const { setStaticPageMeta } = useUrlPageMeta();
      setStaticPageMeta();

      expect(mockUseSeoMeta).toHaveBeenCalledWith({ ogUrl: 'https://shop.example.com/category' });
    });

    it('should set the x-default alternate using the default locale', () => {
      const { setStaticPageMeta } = useUrlPageMeta();
      setStaticPageMeta();

      const links = getCapturedLinks();
      const xDefault = links.find(hasHreflang('x-default'));
      expect(xDefault?.href).toBe('https://shop.example.com/category');
    });

    it('should set an alternate link for every available locale', () => {
      const { setStaticPageMeta } = useUrlPageMeta();
      setStaticPageMeta();

      const links = getCapturedLinks();
      expect(links.find(hasHreflang('en'))?.href).toBe('https://shop.example.com/category');
      expect(links.find(hasHreflang('de'))?.href).toBe('https://shop.example.com/de/category');
    });
  });

  describe('setCategoriesPageMeta', () => {
    const emptyFacetsFromUrl: FacetSearchCriteria = {};

    it('should build the canonical link from the current route when no override is given', () => {
      const { setCategoriesPageMeta } = useUrlPageMeta();
      setCategoriesPageMeta(buildFacet(), emptyFacetsFromUrl);

      const links = getCapturedLinks();
      expect(links.find(isCanonicalLink)?.href).toBe('https://shop.example.com/category');
    });

    it('should use the canonical override when provided', () => {
      const { setCategoriesPageMeta } = useUrlPageMeta();
      setCategoriesPageMeta(buildFacet(), emptyFacetsFromUrl, 'https://shop.example.com/override');

      const links = getCapturedLinks();
      expect(links.find(isCanonicalLink)?.href).toBe('https://shop.example.com/override');
    });

    it('should set ogUrl to the canonical link', () => {
      const { setCategoriesPageMeta } = useUrlPageMeta();
      setCategoriesPageMeta(buildFacet(), emptyFacetsFromUrl);

      expect(mockUseSeoMeta).toHaveBeenCalledWith({ ogUrl: 'https://shop.example.com/category' });
    });

    it('should map the x-default languageUrl using the default locale', () => {
      const { setCategoriesPageMeta } = useUrlPageMeta();
      setCategoriesPageMeta(buildFacet(), emptyFacetsFromUrl);

      const links = getCapturedLinks();
      expect(links.find(hasHreflang('x-default'))?.href).toBe('https://shop.example.com/category');
    });

    it('should map languageUrl keys through the hreflang-to-i18n mapper when building alternates', () => {
      const { setCategoriesPageMeta } = useUrlPageMeta();
      setCategoriesPageMeta(
        buildFacet({ languageUrls: { 'x-default': '/category', zh: '/category-zh' } }),
        emptyFacetsFromUrl,
      );

      expect(localePathMock).toHaveBeenCalledWith('/category-zh', 'cn');
    });

    it('should omit alternates when the facet has no languageUrls', () => {
      const { setCategoriesPageMeta } = useUrlPageMeta();
      setCategoriesPageMeta(buildFacet({ languageUrls: undefined as never }), emptyFacetsFromUrl);

      const links = getCapturedLinks();
      expect(links.filter(isAlternateLink)).toEqual([]);
    });
  });

  describe('getCategoryRobotsContent', () => {
    beforeEach(() => {
      maxIndexedPage.value = 1;
    });

    it('should return an empty string when the facet has no category', () => {
      const { getCategoryRobotsContent } = useUrlPageMeta();
      const robotsContent = getCategoryRobotsContent(ref(buildFacet({ category: undefined as never })));

      expect(robotsContent.value).toBe('');
    });

    it("should return the category's own robots setting within the indexed page range", () => {
      vi.spyOn(categoryGetters, 'getCategoryRobots').mockReturnValue('index, follow');

      const { getCategoryRobotsContent } = useUrlPageMeta();
      const robotsContent = getCategoryRobotsContent(ref(buildFacet()));

      expect(robotsContent.value).toBe('index, follow');
    });

    it('should return "noindex, follow" once the current page exceeds the max indexed page', async () => {
      await navigateToRoute('/category?page=3');
      maxIndexedPage.value = 1;

      const { getCategoryRobotsContent } = useUrlPageMeta();
      const robotsContent = getCategoryRobotsContent(ref(buildFacet()));

      expect(robotsContent.value).toBe('noindex, follow');
    });
  });
});
