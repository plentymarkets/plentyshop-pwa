import type { SessionResult, UserChangePasswordParams } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import type {
  UseCustomerReturn,
  UseCustomerState,
  GetSession,
  LoginAsGuest,
  Login,
  Register,
  Logout,
  SetPrivacyPolicy,
  ChangePassword,
} from '~/composables/useCustomer/types';
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
    privacyPolicy: false,
  }));

  /** Function for checking if user is guest or authorized
   * @example
   * checkUserState();
   */
  const checkUserState = () => {
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
  };

  /** Function for getting current user/cart data from session
   * @example
   * getSession();
   */
  const getSession: GetSession = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    checkUserState();

    state.value.loading = false;
    return state.value.data;
  };

  /** Function for setting user data
   * In like getCart there is the user data available, so we need less requests
   * @example
   * setUser(data: SessionResult);
   */
  const setUser = (data: SessionResult) => {
    state.value.data = data;
    checkUserState();
  };

  /** Function for login a user as guest
   * @example
   * loginAsGuest('user@example.com');
   */
  const loginAsGuest: LoginAsGuest = async (email: string) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLoginAsGuest({ email: email }));
    useHandleError(error.value);
    checkUserState();

    state.value.loading = false;
  };

  /** Function for login a user
   * @example
   * login('user@example.com', 'password');
   */
  const login: Login = async (email: string, password: string) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLogin({ email: email, password: password }));
    state.value.loading = false;
    useHandleError(error.value);

    if (!error.value) {
      await getSession();
    }

    checkUserState();

    return state.value.isAuthorized;
  };

  /** Function for logout a user
   * @example
   * logout();
   */
  const logout: Logout = async () => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doLogoutUser());
    state.value.loading = false;
    useHandleError(error.value);

    state.value.data.user = null;
    checkUserState();
  };

  /** Function for registering a user.
   * @example
   * register({ email: 'example', password: 'example' });
   */
  const register: Register = async (params) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() =>
      useSdk().plentysystems.doRegisterUser({
        email: params.email,
        password: params.password,
      }),
    );

    useHandleError(error.value);
    state.value.loading = false;
    await getSession();
  };

  /**
   * @description Function for setting the privacy policy.
   * @example
   * setPrivacyPolicy({
   *   privacyPolicy: true
   * });
   */
  const setPrivacyPolicy: SetPrivacyPolicy = (privacyPolicy: boolean) => {
    state.value.loading = true;
    state.value.privacyPolicy = privacyPolicy;
    state.value.loading = false;
  };

  /** Function for changing the user password
   * @example
   * changePassword({
   *   oldPassword: 'oldPassword',
   *   password: 'newPassword',
   *   password2: 'newPassword',
   * });
   */
  const changePassword: ChangePassword = async (params: UserChangePasswordParams) => {
    state.value.loading = true;

    const { error } = await useAsyncData(() => useSdk().plentysystems.doChangeUserPassword(params));
    state.value.loading = false;
    useHandleError(error.value);

    return !error.value;
  };

  return {
    setUser,
    getSession,
    login,
    logout,
    register,
    loginAsGuest,
    setPrivacyPolicy,
    changePassword,
    ...toRefs(state.value),
  };
};
