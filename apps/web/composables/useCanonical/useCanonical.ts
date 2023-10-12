import { toRefs } from '@vueuse/shared';
// import { useSdk } from '~/sdk';

/**
 * @description Composable managing canonical data
 * @param slug Canonical slug
 * @returns UseCanonicalReturn
 * @example
 * ``` ts
 * const { data, loading, fetchCanonical } = useCanonical('canonical-slug');
 * ```
 */
export const useCanonical: UseCanonicalReturn = (url) => {
  const state = useState<UseCanonicalState>(`useCanonical-${url}`, () => ({
    loading: false,
  }));

  return {
    ...toRefs(state.value),
  };
};
