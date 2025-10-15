import type { ApiError } from '@plentymarkets/shop-api'; //TODO: load params type from here later as well
import type {
  UseNotifyMeState,
  UseNotifyMeReturn,
  Subscribe,
  NotifyMeSubscribeParams,
} from '~/composables/useNotifyMe/types';

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

      // TODO: implement call once its built
      // const { data } = await useSdk().plentysystems.doSubscribeNotifyMe(params);
      // return !!data;

      // Mock call for development TODO: remove later
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return true;
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
