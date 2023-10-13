import { toRefs } from '@vueuse/shared';
// import { useSdk } from '~/sdk';
import type { UseCanonicalReturn } from './types';
import { UseCanonicalState } from './types';
import {GetCart} from "~/composables/useCart/types";

/**
 * @description Composable managing canonical data
 * @param url Canonical slug
 * @returns UseCanonicalReturn
 * @example
 * ``` ts
 * const { data, loading, fetchCanonical } = useCanonical('canonical-slug');
 * ```
 */
export const useCanonical: UseCanonicalReturn = () => {
  const state = useState<UseCanonicalState>(`useCanonical`, () => ({
    loading: false,
  }));

  const setStaticPageMeta: GetCart = async () => {
    state.value.loading = true;

    const route = useRoute();
    const runtimeConfig = useRuntimeConfig();
    const localePath = useLocalePath();
    const { locales, defaultLocale } = useI18n();

    const alternateLocales = locales.value.map((item) => {
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
