import type { UseUrlPageMetaReturn, StaticPageMeta, CategoriesPageMeta, UseUrlPageMetaState } from './types';
import type { Facet, FacetSearchCriteria } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';

/**
 * @description Composable managing canonical data, og:url and href alernates
 * @returns UseUrlPageMetaReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useUrlPageMeta();
 * ```
 */

const setPreviousAndNextLink = (productsCatalog: Facet, facetsFromUrl: FacetSearchCriteria, canonicalLink: string) => {
  if (!facetsFromUrl?.itemsPerPage || !facetsFromUrl?.page) {
    return;
  }

  if (facetsFromUrl.page === 2) {
    useHead({
      link: [
        {
          rel: 'prev',
          href: canonicalLink,
        },
      ],
    });
  }
  if (facetsFromUrl.page > 2) {
    useHead({
      link: [
        {
          rel: 'prev',
          href: `${canonicalLink}?page=${facetsFromUrl.page - 1}`,
        },
      ],
    });
  }
  if (
    productsCatalog.pagination?.totals &&
    facetsFromUrl.page < productsCatalog.pagination.totals / facetsFromUrl.itemsPerPage
  ) {
    useHead({
      link: [
        {
          rel: 'next',
          href: `${canonicalLink}?page=${facetsFromUrl.page + 1}`,
        },
      ],
    });
  }
};

export const useUrlPageMeta: UseUrlPageMetaReturn = () => {
  const state = useState<UseUrlPageMetaState>(`useUrlPageMeta`, () => ({
    loading: false,
  }));
  const { applyToUrl: applyTrailingSlashToUrl } = useUrlTrailingSlash();

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
    const { defaultLocale } = useI18n();
    const { getAvailableLocales } = useLocalization();

    const canonicalUrl = applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localePath(route.fullPath)}`);

    const alternateLocales = getAvailableLocales().map((locale: Locale) => {
      return {
        rel: 'alternate',
        hreflang: locale,
        href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localePath(route.fullPath, locale)}`),
      };
    });

    useHead({
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

    useHead({
      link: [
        {
          rel: 'canonical',
          href: canonicalLink,
        },
      ],
    });

    useSeoMeta({
      ogUrl: canonicalLink,
    });

    if (productsCatalog.languageUrls) {
      Object.keys(productsCatalog.languageUrls).forEach((key) => {
        const localizedPath =
          key === `x-default`
            ? localePath(productsCatalog.languageUrls[key] || '/', $i18n.defaultLocale)
            : localePath(productsCatalog.languageUrls[key] || '/', key as Locale);

        useHead({
          link: [
            {
              rel: 'alternate',
              hreflang: key,
              href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localizedPath}${querySuffix}`),
            },
          ],
        });
      });
    }
    setPreviousAndNextLink(productsCatalog, facetsFromUrl, canonicalLink);
    state.value.loading = false;
  };

  return {
    setStaticPageMeta,
    setCategoriesPageMeta,
    ...toRefs(state.value),
  };
};
