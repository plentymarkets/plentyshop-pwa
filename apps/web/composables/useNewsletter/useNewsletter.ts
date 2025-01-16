import type { NewsletterParams } from '@plentymarkets/shop-api';
import type { UseNewsletterReturn, UseNewsletterState, Subscribe } from '~/composables/useNewsletter/types';

/**
 * @description Composable for subscribing/unsubscribing to newsletter.
 * @returns UseNewsletterReturn
 * @example
 * ``` ts
 * const { loading, subscribe } = useNewsletter();
 * ```
 */
export const useNewsletter: UseNewsletterReturn = () => {
  const state = useState<UseNewsletterState>('useNewsletter', () => ({
    loading: false,
  }));

  /**
   * @description Function for subscribing to newsletter.
   * @param params { NewsletterParams }
   * @return Promise<boolean>
   * @example
   * ``` ts
   * subscribe({
   *   email: 'test@test.de',
   *   emailFolder: 1,
   * })
   * ```
   */
  const subscribe: Subscribe = async (params: NewsletterParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doSubscribeNewsletter(params));
    useHandleError(error.value);

    state.value.loading = false;
    return !!data.value?.data;
  };

  return {
    subscribe,
    ...toRefs(state.value),
  };
};
