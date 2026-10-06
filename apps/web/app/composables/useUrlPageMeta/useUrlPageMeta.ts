import type { UseUrlPageMetaReturn, StaticPageMeta, CategoriesPageMeta, GetCategoryRobotsContent } from './types';
import { categoryGetters, type Facet, type FacetSearchCriteria } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';

const setPreviousAndNextLink = (
  productsCatalog: Facet,
  facetsFromUrl: FacetSearchCriteria,
  canonicalLink: string,
  patchPrevHead: typeof useHead,
  patchNextHead: typeof useHead,
  // eslint-disable-next-line max-params
) => {
  if (!facetsFromUrl?.itemsPerPage || !facetsFromUrl?.page) {
    patchPrevHead({});
    patchNextHead({});
    return;
  }

  const domain = useRuntimeConfig().public.domain as string;
  const url = new URL(canonicalLink, domain);
  const baseUrl = `${url.origin}${url.pathname}`;

  if (facetsFromUrl.page >= 2) {
    const prevParams = new URLSearchParams(url.search);
    if (facetsFromUrl.page === 2) {
      prevParams.delete('page');
    } else {
      prevParams.set('page', String(facetsFromUrl.page - 1));
    }
    const prevSearch = prevParams.toString();
    patchPrevHead({
      link: [
        {
          rel: 'prev',
          href: prevSearch ? `${baseUrl}?${prevSearch}` : baseUrl,
        },
      ],
    });
  } else {
    patchPrevHead({});
  }
  if (
    productsCatalog.pagination?.totals &&
    facetsFromUrl.page < productsCatalog.pagination.totals / facetsFromUrl.itemsPerPage
  ) {
    const nextParams = new URLSearchParams(url.search);
    nextParams.set('page', String(facetsFromUrl.page + 1));
    patchNextHead({
      link: [
        {
          rel: 'next',
          href: `${baseUrl}?${nextParams.toString()}`,
        },
      ],
    });
  } else {
    patchNextHead({});
  }
};

/**
 * @description Composable managing canonical data, og:url and href alernates
 * @returns UseUrlPageMetaReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useUrlPageMeta();
 * ```
 */
export const useUrlPageMeta: UseUrlPageMetaReturn = () => {
  const state = useState(`useUrlPageMeta`, () => ({
    loading: false,
  }));
  const { applyToUrl: applyTrailingSlashToUrl } = useUrlTrailingSlash();
  const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
    _urlPageMetaHead?: ReturnType<typeof useHead>;
    _urlPageMetaPrevHead?: ReturnType<typeof useHead>;
    _urlPageMetaNextHead?: ReturnType<typeof useHead>;
  };

  /**
   * @description Builds a function that replaces the previous head entry for the given
   * nuxtApp slot instead of patching it, so link tags (e.g. hreflang alternates, prev/next)
   * that are absent from the new input are actually removed instead of lingering when the
   * new set only partially overlaps with the previous one.
   */
  const createHeadPatcher = (
    slot: '_urlPageMetaHead' | '_urlPageMetaPrevHead' | '_urlPageMetaNextHead',
  ): typeof useHead => {
    return (input) => {
      nuxtApp[slot]?.dispose();
      nuxtApp[slot] = useHead(input);
      return nuxtApp[slot];
    };
  };

  const patchHead = createHeadPatcher('_urlPageMetaHead');
  const patchPrevHead = createHeadPatcher('_urlPageMetaPrevHead');
  const patchNextHead = createHeadPatcher('_urlPageMetaNextHead');

  /**
   * @description Function for setting static page metas.
   * @returns StaticPageMeta
   * @example
   * ``` ts
   * setStaticPageMeta()
   * ```
   */
  const setStaticPageMeta: StaticPageMeta = () => {
    state.value.loading = true;

    const route = useRouter().currentRoute.value;
    const runtimeConfig = useRuntimeConfig();
    const localePath = useLocalePath();
    const { defaultLocale } = nuxtApp.$i18n;
    const { getAvailableLocales } = useLocalization();

    const canonicalUrl = applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localePath(route.fullPath)}`);

    const alternateLocales = getAvailableLocales().map((locale: Locale) => {
      return {
        rel: 'alternate' as const,
        hreflang: locale,
        href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localePath(route.fullPath, locale)}`),
      };
    });

    patchHead({
      link: [
        { rel: 'canonical', href: canonicalUrl },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localePath(route.fullPath, defaultLocale)}`),
        },
        ...alternateLocales,
      ],
    });

    patchPrevHead({});
    patchNextHead({});

    useSeoMeta({
      ogUrl: canonicalUrl,
    });

    state.value.loading = false;
  };

  /**
   * @description Function for setting categories page metas.
   * @returns CategoriesPageMeta
   * @example
   * ``` ts
   * setCategoriesPageMeta()
   * ```
   */
  const setCategoriesPageMeta: CategoriesPageMeta = (
    productsCatalog: Facet,
    facetsFromUrl: FacetSearchCriteria,
    canonicalOverride?: string,
  ) => {
    state.value.loading = true;
    const { $i18n } = useNuxtApp();
    const route = useRouter().currentRoute.value;
    const localePath = useLocalePath();
    const runtimeConfig = useRuntimeConfig();

    const queryString = new URLSearchParams(route.query as Record<string, string>).toString();
    const querySuffix = queryString ? `?${queryString}` : '';

    const canonicalLink =
      canonicalOverride && canonicalOverride.trim() !== ''
        ? applyTrailingSlashToUrl(canonicalOverride)
        : applyTrailingSlashToUrl(
            `${runtimeConfig.public.domain}${localePath(route.path, $i18n.locale.value)}${querySuffix}`,
          );

    useSeoMeta({
      ogUrl: canonicalLink,
    });

    let alternateLocales: { rel: 'alternate'; hreflang: string; href: string }[] = [];
    if (productsCatalog.languageUrls) {
      alternateLocales = Object.keys(productsCatalog.languageUrls).map((key) => {
        const i18nKey = hreflangLocaleMapperToI18n(key);
        const localizedPath =
          key === `x-default`
            ? localePath(
                productsCatalog.languageUrls[key] || '/',
                hreflangLocaleMapperToI18n($i18n.defaultLocale) as Locale,
              )
            : localePath(productsCatalog.languageUrls[key] || '/', i18nKey as Locale);

        return {
          rel: 'alternate' as const,
          hreflang: key,
          href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localizedPath}${querySuffix}`),
        };
      });
    }

    patchHead({
      link: [
        {
          rel: 'canonical',
          href: canonicalLink,
        },
        ...alternateLocales,
      ],
    });

    setPreviousAndNextLink(productsCatalog, facetsFromUrl, canonicalLink, patchPrevHead, patchNextHead);
    state.value.loading = false;
  };

  /**
   * @description Computed robots meta content for category pages. Returns `noindex, follow`
   * when the current page number exceeds the configured max indexed page; otherwise falls back
   * to the category's own robots setting.
   * @returns ComputedRef<string>
   * @example
   * ``` ts
   * const robotsContent = getCategoryRobotsContent(productsCatalog);
   * ```
   */
  const getCategoryRobotsContent: GetCategoryRobotsContent = (productsCatalog) => {
    const route = useRoute();
    const { getNumberSetting: getSeoCategoryRobotsNoIndex } = useSiteSettings('seoCategoryRobotsNoIndex');
    const currentPage = computed(() => Number(route.query.page as string) || 1);
    const maxIndexedPage = computed(() => {
      const value = getSeoCategoryRobotsNoIndex(1);
      return value > 0 ? value : 1;
    });

    return computed((): string => {
      if (!productsCatalog.value?.category) {
        return '';
      }

      if (currentPage.value >= maxIndexedPage.value + 1) {
        return 'noindex, follow';
      }
      return categoryGetters.getCategoryRobots(productsCatalog.value.category);
    });
  };

  return {
    setStaticPageMeta,
    setCategoriesPageMeta,
    getCategoryRobotsContent,
    ...toRefs(state.value),
  };
};
