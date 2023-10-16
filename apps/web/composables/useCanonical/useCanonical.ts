import { toRefs } from '@vueuse/shared';
import type { UseCanonicalReturn } from './types';
import { StaticPageMeta, UseCanonicalState } from './types';

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

  return {
    setStaticPageMeta,
    ...toRefs(state.value),
  };
};
