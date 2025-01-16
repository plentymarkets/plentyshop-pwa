import type { UseCanonicalReturn, StaticPageMeta, CategoriesPageMeta, UseCanonicalState } from './types';
import type { Facet, FacetSearchCriteria } from '@plentymarkets/shop-api';
import type { LocaleObject } from '@nuxtjs/i18n';

/**
 * @description Composable managing canonical data
 * @returns UseCanonicalReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useCanonical();
 * ```
 */

const setPreviousAndNextLink = (productsCatalog: Facet, facetsFromUrl: FacetSearchCriteria, canonicalLink: string) => {
  if (facetsFromUrl && facetsFromUrl.itemsPerPage && facetsFromUrl.page) {
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
    if (facetsFromUrl.page < productsCatalog.pagination.totals / facetsFromUrl.itemsPerPage) {
      useHead({
        link: [
          {
            rel: 'next',
            href: `${canonicalLink}?page=${facetsFromUrl.page + 1}`,
          },
        ],
      });
    }
  }
};

export const useCanonical: UseCanonicalReturn = () => {
  const state = useState<UseCanonicalState>(`useCanonical`, () => ({
    loading: false,
  }));

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

    const route = useNuxtApp().$router.currentRoute.value;
    const runtimeConfig = useRuntimeConfig();
    const localePath = useLocalePath();
    const { locales, defaultLocale } = useI18n();

    const alternateLocales = locales.value.map((item: LocaleObject) => {
      return {
        rel: 'alternate',
        hreflang: item.code,
        href: `${runtimeConfig.public.domain}${localePath(route.fullPath, item.code)}`,
      };
    });

    useHead({
      link: [
        { rel: 'canonical', href: `${runtimeConfig.public.domain}${localePath(route.fullPath)}` },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${runtimeConfig.public.domain}${localePath(route.fullPath, defaultLocale)}`,
        },
        ...alternateLocales,
      ],
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
  const setCategoriesPageMeta: CategoriesPageMeta = (productsCatalog: Facet, facetsFromUrl: FacetSearchCriteria) => {
    state.value.loading = true;
    const { $i18n, $router } = useNuxtApp();
    const route = $router.currentRoute.value;
    const localePath = useLocalePath();
    const runtimeConfig = useRuntimeConfig();

    const canonicalLink = `${runtimeConfig.public.domain}${localePath(route.fullPath, $i18n.locale.value)}`;
    useHead({
      link: [
        {
          rel: 'canonical',
          href: canonicalLink,
        },
      ],
    });
    if (productsCatalog.languageUrls) {
      Object.keys(productsCatalog.languageUrls).forEach((key) => {
        useHead({
          link: [
            {
              rel: 'alternate',
              hreflang: key,
              href:
                key === `x-default`
                  ? `${runtimeConfig.public.domain}${localePath(route.fullPath, $i18n.locale.value)}`
                  : `${runtimeConfig.public.domain}${localePath(route.fullPath, key)}`,
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
