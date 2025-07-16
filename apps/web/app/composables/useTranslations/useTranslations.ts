import type { UseTranslationsReturn, FetchTranslations, UseTranslationsState } from './types';

/**
 * @description Composable for managing translations.
 * @returns UseTranslationsReturn
 * @example
 * ``` ts
 * const {
 * data, loading, fetchTranslations
 * } = useTranslations();
 * ```
 */
export const useTranslations: UseTranslationsReturn = () => {
  const state = useState<UseTranslationsState>('useTranslations', () => ({
    data: '',
    loading: false,
  }));

  /**
   * @description Function for fetching the translations.
   * @return FetchTranslations
   * @example
   * ``` ts
   * fetchTranslations('en');
   * ```
   */
  const fetchTranslations: FetchTranslations = async (locale: string) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(`translations-${locale}`, () => useSdk().plentysystems.getTranslations({ locale }), {
        deep: true
      });

      if (error.value) {
        useHandleError(error.value);
      }

      state.value.data = data?.value?.data as string;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    fetchTranslations,
    ...toRefs(state.value),
  };
};
