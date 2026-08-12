import type { ApiError, NewsletterParams } from '@plentymarkets/shop-api';
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
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.doSubscribeNewsletter(params);
      return !!data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  const unsubscribe: Unsubscribe = async (params) => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.deleteNewsletterSubscription(params);
      return !!data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  return {
    subscribe,
    unsubscribe,
    ...toRefs(state.value),
  };
};
