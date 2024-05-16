import type { Cart, SessionResult } from '@plentymarkets/shop-api';
import { useSdk } from '~/sdk';
import type { SetInitialData, UseInitialSetupReturn, UseInitialSetupState } from './types';

/**
 * @description Composable to get initial customer and cart data
 * @returns UseInitialSetupReturn
 * @example
 * ``` ts
 * const { setInitialData } = useInitialSetup();
 * ```
 */
export const useInitialSetup: UseInitialSetupReturn = () => {
  const nuxtApp = useNuxtApp();
  const state = useState<UseInitialSetupState>('useInitialSetup', () => ({
    ssrLocale: '',
    loading: false,
  }));

  /** Function for getting current customer/cart data from session
   * @return SetInitialData
   * @example
   * ``` ts
   * setInitialData();
   * ```
   */
  const setInitialData: SetInitialData = async () => {
    const { setCart, loading: cartLoading } = useCart();
    state.value.loading = true;
    cartLoading.value = true;

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);

    if (data?.value?.data) {
      const { setUser } = useCustomer();
      setUser(data.value?.data as SessionResult);
      setCart(data.value?.data.basket as Cart);
    }

    cartLoading.value = false;
    state.value.loading = false;
    return true;
  };

  /** Function for getting category tree and current customer/cart data from session
   * @return SetInitialData
   * @example
   * ``` ts
   * setInitialDataSSR();
   * ```
   */
  const setInitialDataSSR: SetInitialData = async () => {
    const { setCart, loading: cartLoading } = useCart();

    state.value.loading = true;
    cartLoading.value = true;

    try {
      const { data } = await useSdk().plentysystems.getInit();

      if (data) {
        const { setUser } = useCustomer();
        const { setCategoryTree } = useCategoryTree();
        const { setWishlistItemIds } = useWishlist();

        nuxtApp.runWithContext(() => {
          setUser((data?.session || {}) as SessionResult);
          setCart((data?.session?.basket || {}) as Cart);
          setCategoryTree(data?.categories || []);
          setWishlistItemIds(data?.session?.basket?.itemWishListIds || []);
        });
      }
    } catch (error) {
      throw new Error(error as string);
    } finally {
      state.value.loading = false;
      cartLoading.value = false;
    }

    return true;
  };

  return {
    setInitialData,
    setInitialDataSSR,
    ...toRefs(state.value),
  };
};
