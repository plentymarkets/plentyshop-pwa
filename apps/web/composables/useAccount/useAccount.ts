import type { SessionResult } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import type { UseAccountReturn, UseAccountState, FetchAccount, LoginAsGuest } from '~/composables/useAccount/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable managing account data
 * @returns {@link UseAccountReturn}
 * @example
 * const { data, loading, fetchAccount } = useAccount();
 */
export const useAccount: UseAccountReturn = () => {
  const state = useState<UseAccountState>(`useAccount`, () => ({
    data: {} as SessionResult,
    loading: false,
  }));

  /** Function for fetching account data
   * @example
   * fetchAccount();
   */
  const fetchAccount: FetchAccount = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  const loginAsGuest: LoginAsGuest = async (email: string) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLoginAsGuest({ email: email }));
    useHandleError(error.value);

    state.value.loading = false;
  };

  return {
    fetchAccount,
    loginAsGuest,
    ...toRefs(state.value),
  };
};
