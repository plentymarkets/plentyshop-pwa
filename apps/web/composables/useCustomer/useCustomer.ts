import type { SessionResult } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import type { UseCustomerReturn, UseCustomerState, GetSession, LoginAsGuest } from '~/composables/useCustomer/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable managing Customer data
 * @returns {@link UseCustomerReturn}
 * @example
 * const { data, loading, fetchCustomer } = useCustomer();
 */
export const useCustomer: UseCustomerReturn = () => {
  const state = useState<UseCustomerState>(`useCustomer`, () => ({
    data: {} as SessionResult,
    loading: false,
    isAuthorized: false,
    isGuest: false,
  }));

  /** Function for getting current user/cart data from session
   * @example
   * getSession();
   */
  const getSession: GetSession = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;

    if (state.value.data?.user?.guestMail) {
      state.value.isGuest = true;
      state.value.isAuthorized = false;
    } else if (state.value.data?.user?.email) {
      state.value.isGuest = false;
      state.value.isAuthorized = true;
    } else {
      state.value.isGuest = false;
      state.value.isAuthorized = false;
    }

    state.value.loading = false;
    return state.value.data;
  };

  const setUser = (data: SessionResult) => {
    state.value.data = data;
  };

  /** Function for login a user as guest
   * @example
   * loginAsGuest('user@example.com');
   */
  const loginAsGuest: LoginAsGuest = async (email: string) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLoginAsGuest({ email: email }));
    useHandleError(error.value);

    state.value.loading = false;
  };

  return {
    setUser,
    getSession,
    loginAsGuest,
    ...toRefs(state.value),
  };
};
