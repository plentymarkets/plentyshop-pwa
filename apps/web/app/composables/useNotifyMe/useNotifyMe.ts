import type { ApiError } from '@plentymarkets/shop-api';

export interface NotifyMeSubscribeParams {
  email: string;
  variationId: number;
  turnstileToken?: string;
}

export interface UseNotifyMeState {
  loading: boolean;
}

/**
 * @description Composable for subscribing to the back in stock notifications.
 * @example
 * ``` ts
 * const { loading, subscribe } = useNotifyMe();
 * ```
 */
export const useNotifyMe = () => {
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
  const subscribe = async (params: NotifyMeSubscribeParams): Promise<boolean> => {
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
