import type { ApiError } from '@plentymarkets/shop-api';

/**
 * @description Composable to fetch current session data including user and cart information.
 * @example
 * ``` ts
 * const { loading, fetchSession } = useFetchSession();
 * ```
 */
export const useFetchSession = () => {
  const state = useState(`useFetchSession`, () => ({
    loading: false,
  }));

  /** Function for getting current user/cart data from session
   * @example
   * ``` ts
   * fetchSession();
   * ```
   */
  const fetchSession = async () => {
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
    fetchSession,
    ...toRefs(state.value),
  };
};
