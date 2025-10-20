import type { ApiError, NotifyMeSubscribeParams } from '@plentymarkets/shop-api';
import type { UseNotifyMeState, UseNotifyMeReturn, Subscribe } from '~/composables/useNotifyMe/types';

/**
 * @description Composable for subscribing to the back in stock notifications.
 * @return UseNotifyMeReturn
 * @example
 * ``` ts
 * const { loading, subscribe } = useNotifyMe();
 * ```
 */
export const useNotifyMe: UseNotifyMeReturn = () => {
  const state = useState<UseNotifyMeState>('useNotifyMe', () => ({
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
  const subscribe: Subscribe = async (params: NotifyMeSubscribeParams) => {
    try {
      state.value.loading = true;

      const { data } = await useSdk().plentysystems.doSubscribeNotifyMe(params);
      return !!data;
    } catch (error) {
      useHandleError(error as ApiError);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    subscribe,
    ...toRefs(state.value),
  };
};
