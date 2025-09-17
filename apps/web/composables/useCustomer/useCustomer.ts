import {
  AddressType,
  type ApiError,
  type RegisterParams,
  type User,
  type UserChangeResponse,
  type UserChangePasswordParams,
  userGetters,
} from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const CONTACT_INFORMATION = '#contact-information';

/**
 * @description Composable managing Customer data
 * @returns UseCustomerReturn
 * @example
 * ``` ts
 * const {
 * data, loading, isAuthorized, isGuest, privacyPolicy, setUser, getSession, login, logout, register, loginAsGuest,
 * setPrivacyPolicy, changePassword } = useCustomer();
 * ```
 */
export const useCustomer = () => {
  const { emit } = usePlentyEvent();
  const { $i18n } = useNuxtApp();
  const state = useState(`useCustomer`, () => ({
    user: null as User | null,
    loading: false,
    isAuthorized: false,
    isGuest: false,
    validGuestEmail: false,
  }));

  /** Function for checking if user is guest or authorized
   * @example
   * ``` ts
   * checkUserState();
   * ```
   */
  const checkUserState = () => {
    if (state.value.user?.guestMail) {
      state.value.isGuest = true;
      state.value.validGuestEmail = true;
      state.value.isAuthorized = false;
      return;
    }

    state.value.isGuest = false;
    state.value.validGuestEmail = false;
    state.value.isAuthorized = !!state.value.user?.email;
  };

  /** Function for getting current user/cart data from session
   * @deprecated This method will be removed in future versions. Use `useFetchSession().fetchSession()` instead.
   * @example
   * ``` ts
   * getSession();
   * ```
   */
  const getSession = async () => {
    await useFetchSession().fetchSession();
  };

  /** Function for setting user data
   * @param user { User | null }
   * @example
   * ``` ts
   * setUser(data: SessionResult);
   * ```
   */
  const setUser = (user: User | null) => {
    state.value.user = user;
    checkUserState();
  };

  /** Function for login a user as guest
   * @param email
   * @return Promise<void>
   * @example
   * ``` ts
   * loginAsGuest('user@example.com');
   * ```
   */
  const loginAsGuest = async (email: string) => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.doLoginAsGuest({ email: email });

      if (data && data.basket) {
        const { setCart } = useCart();
        setUser(data.user ?? null);
        setCart(data.basket);
      } else {
        await useFetchSession().fetchSession();
      }
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  /** Function for user login.
   * @param email
   * @param password
   * @return Promise<boolean>
   * @example
   * ``` ts
   * login('user@example.com', 'password');
   * ```
   */
  const login = async (email: string, password: string) => {
    state.value.loading = true;

    try {
      await useSdk().plentysystems.doLogin({ email: email, password: password });
      await useFetchSession().fetchSession();

      if (state.value.user) {
        emit('frontend:login', { user: state.value.user });
      }

      return state.value.isAuthorized;
    } catch (error) {
      useHandleError(error as ApiError);
      state.value.loading = false;
      return false;
    }
  };

  /** Function for user logout.
   * @return Promise<void>
   * @example
   * ``` ts
   * logout();
   * ```
   */
  const logout = async () => {
    try {
      state.value.loading = true;
      await useSdk().plentysystems.doLogoutUser();
      state.value.user = null;
      useCheckoutAddress(AddressType.Shipping).clear();
      useCheckoutAddress(AddressType.Billing).clear();
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }

    checkUserState();
    useWishlist().setWishlistItemIds([]);
  };

  /** Function for registering a user.
   * @param params { RegisterParams }
   * @return Promise<UserChangeResponse | null>
   * @example
   * ``` ts
   * register({ email: 'example', password: 'example', 'cf-turnstile-response': '' });
   * ```
   */
  const register = async (params: RegisterParams): Promise<UserChangeResponse | null> => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.doRegisterUser(params);
      if (data) {
        await useFetchSession().fetchSession();

        if (state.value.user) {
          emit('frontend:signUp', { user: state.value.user });
        }
      }
      return data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return null;
  };

  /** Function for changing the user password
   * @param params { UserChangePasswordParams }
   * @return Promise<boolean>
   * @example
   * ``` ts
   * changePassword({
   *   oldPassword: 'oldPassword',
   *   password: 'newPassword',
   *   password2: 'newPassword',
   * });
   * ```
   */
  const changePassword = async (params: UserChangePasswordParams) => {
    state.value.loading = true;

    try {
      await useSdk().plentysystems.doChangeUserPassword(params);
      return true;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  const emailValidationSchema = toTypedSchema(
    object({
      customerEmail: string()
        .required($i18n.t('errorMessages.email.required'))
        .test('is-valid-email', $i18n.t('errorMessages.email.valid'), (email: string) =>
          userGetters.isValidEmailAddress(email),
        )
        .default(state.value.user?.email ?? state.value.user?.guestMail ?? ''),
    }),
  );

  const missingGuestCheckoutEmail = computed(
    () => (state.value.isGuest || (!state.value.isGuest && !state.value.isAuthorized)) && !state.value.validGuestEmail,
  );

  const backToContactInformation = (): boolean => {
    const classList = ['bg-primary-50', 'rounded-md'];
    const opacityClass = 'opacity-0';
    const targetId = CONTACT_INFORMATION;

    const targetElement = document.querySelector(targetId);
    const firstDivider = document.querySelector('#top-contact-information-divider');
    const secondDivider = document.querySelector('#top-shipping-divider');

    scrollToHTMLObject(targetId);

    targetElement?.classList.add(...classList);
    [firstDivider, secondDivider].forEach((divider) => divider?.classList.add(opacityClass));

    setTimeout(() => {
      targetElement?.classList.remove(...classList);
      [firstDivider, secondDivider].forEach((divider) => divider?.classList.remove(opacityClass));
    }, 1000);

    return false;
  };

  return {
    setUser,
    getSession,
    login,
    logout,
    register,
    loginAsGuest,
    changePassword,
    emailValidationSchema,
    missingGuestCheckoutEmail,
    backToContactInformation,
    ...toRefs(state.value),
  };
};
