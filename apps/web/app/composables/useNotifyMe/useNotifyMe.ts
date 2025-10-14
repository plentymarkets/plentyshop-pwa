import type { ApiError } from '@plentymarkets/shop-api';

/**
 * @description Composable for subscribing to the back in stock notifications.
 * @example
 * ``` ts
 * const { loading, subscribe } = useNotifyMe();
 * ```
 */
export const useNotifyMe = () => {
  const state = useState<UseNewsletterState>('useNotifyMe', () => ({
    loading: false,
  }));

  /**
   * @description Function for subscribing to the back in stock notifications.
   * @param params { NotifyMeSubscribeParams }
   * @return Promise<boolean>
   * @example
   * ``` ts
   * subscribe({
   *   email: 'test@test.de',
   *   variationId: 1,
   *   turnstileToken: '[token]'
   * })
   * ```
   */
  const subscribe = async () => {
    try {
      state.value.loading = true;

      //TODO: implement call once its build
      // const { data } = await useSdk().plentysystems.doSubscribeNotifyMe(params);
      // return !!data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  return {
    subscribe,
    ...toRefs(state.value),
  };
};
