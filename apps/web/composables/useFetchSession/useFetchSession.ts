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
 * @description Composable to fetch current session data including user and cart information.
 * @example
 * ``` ts
 * const { loading, getSession } = useFetchSession();
 * ```
 */
export const useFetchSession = () => {
  const state = useState(`useFetchSession`, () => ({
    loading: false,
  }));

  /** Function for getting current user/cart data from session
   * @example
   * ``` ts
   * getSession();
   * ```
   */
  const getSession = async () => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.getSession();
      const { setCart } = useCart();
      const { setUser } = useCustomer();
      setCart(data.basket);
      setUser(data.user);
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    getSession,
    ...toRefs(state.value),
  };
};
