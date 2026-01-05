import type { ApiError, NotifyMeSubscribeParams, NotifyMeRouteTokenParams } from '@plentymarkets/shop-api';

/**
 * @description Composable for subscribing to the back in stock notifications.
 * @return UseNotifyMeReturn
 * @example
 * ``` ts
 * const { loading, subscribe, confirmNotifyMe, unsubscribeNotifyMe } = useNotifyMe();
 * ```
 */
export const useNotifyMe = () => {
  const state = useState('useNotifyMe', () => ({
    loading: false,
  }));

  /**
   * @description Function for subscribing to the back in stock notifications.
   * @param params { NotifyMeSubscribeParams }
   * @example
   * ``` ts
   * const result = await subscribe({
   *   email: 'test@test.de',
   *   variationId: 1,
   *   lang: 'de',
   *   'cf-turnstile-response': '[token]'
   * });
   * ```
   */
  const subscribe = async (params: NotifyMeSubscribeParams) => {
    try {
      state.value.loading = true;

      const { data } = await useSdk().plentysystems.doSubscribeNotifyMe(params);
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for confirming the back in stock notifications subscription (opt-in).
   * @param params { NotifyMeRouteTokenParams }
   * @return ConfirmNotifyMe
   * @example
   * ``` ts
   * const result = await confirmNotifyMe({token: '[token]'});
   * ```
   */
  const confirmNotifyMe = async (params: NotifyMeRouteTokenParams) => {
    try {
      state.value.loading = true;

      const { data } = await useSdk().plentysystems.doConfirmNotifyMe(params);
      return data;
    } catch {
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for unsubscribing from notify me notifications.
   * @param params { NotifyMeRouteTokenParams }
   * @return UnsubscribeNotifyMe
   * @example
   * ``` ts
   * const result = await unsubscribeNotifyMe({token: '[token]'});
   * ```
   */
  const unsubscribeNotifyMe = async (params: NotifyMeRouteTokenParams) => {
    try {
      state.value.loading = true;

      const { data } = await useSdk().plentysystems.doUnsubscribeNotifyMe(params);
      return data;
    } catch {
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    subscribe,
    confirmNotifyMe,
    unsubscribeNotifyMe,
    ...toRefs(state.value),
  };
};
