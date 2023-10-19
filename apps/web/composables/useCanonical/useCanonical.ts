import { toRefs } from '@vueuse/shared';
import type { UseCanonicalReturn } from './types';
import { StaticPageMeta, CategoriesPageMeta, UseCanonicalState } from './types';

/**
 * @description Composable managing canonical data
 * @returns UseCanonicalReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useCanonical();
 * ```
 */
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

    const route = useRoute();
    const runtimeConfig = useRuntimeConfig();
    const localePath = useLocalePath();
    const { locales, defaultLocale } = useI18n();

    const alternateLocales = locales.value.map((item: any) => {
      return {
        rel: 'alternate',
        hreflang: item.code,
        href: `${runtimeConfig.public.apiUrl}${localePath(route.fullPath, item.code)}`,
      };
    });

    useHead({
      link: [
        { rel: 'canonical', href: `${runtimeConfig.public.apiUrl}${localePath(route.fullPath)}` },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${runtimeConfig.public.apiUrl}${localePath(route.fullPath, defaultLocale)}`,
        },
        ...alternateLocales,
      ],
    });

    state.value.loading = false;
  };

  const setCategoriesPageMeta: CategoriesPageMeta = (productsCatalog: any, facetsFromUrl: any) => {
    state.value.loading = true;
    const runtimeConfig = useRuntimeConfig();
    if (productsCatalog.value.languageUrls) {
      // const facetsFromUrl = getFacetsFromURL();
      let xdefault = productsCatalog.value.languageUrls['x-default'];
      xdefault = xdefault[xdefault.length - 1] === '/' ? xdefault.slice(0, Math.max(0, xdefault.length - 1)) : xdefault;
      const canonicalLink = facetsFromUrl.facets
        ? `${runtimeConfig.public.apiUrl}/c${xdefault}?=${facetsFromUrl.facets}`
        : `${runtimeConfig.public.apiUrl}/c${xdefault}`;
      useHead({
        link: [
          {
            rel: 'canonical',
            href: canonicalLink,
          },
        ],
      });
      Object.keys(productsCatalog.value.languageUrls).forEach((key) => {
        let link = productsCatalog.value.languageUrls[key];
        link = link[link.length - 1] === '/' ? link.slice(0, Math.max(0, link.length - 1)) : link;
        useHead({
          link: [
            {
              rel: 'alternate',
              hreflang: key,
              href: `${runtimeConfig.public.apiUrl}/c${link}`,
            },
          ],
        });
      });
 
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
        if (facetsFromUrl.page < productsCatalog.value.pagination.totals / facetsFromUrl.itemsPerPage) {
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
    }
    state.value.loading = false;
  };

  return {
    setStaticPageMeta,
    setCategoriesPageMeta,
    ...toRefs(state.value),
  };
};
