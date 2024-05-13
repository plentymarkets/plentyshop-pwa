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
  const state = useState<UseInitialSetupState>('useInitialSetup', () => ({
    ssrLocale: '',
    loading: false,
  }));

  const { setUser } = useCustomer();
  const { setCart, loading: cartLoading } = useCart();
  const { setCategoryTree } = useCategoryTree();
  const { setWishlistItemIds } = useWishlist();

  /** Function for getting current customer/cart data from session
   * @return SetInitialData
   * @example
   * ``` ts
   * setInitialData();
   * ```
   */
  const setInitialData: SetInitialData = async () => {
    state.value.loading = true;
    cartLoading.value = true;

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);

    if (data?.value?.data) {
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
    state.value.loading = true;
    cartLoading.value = true;

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getInit());
    useHandleError(error.value);

    if (data?.value?.data) {
      useNuxtApp().runWithContext(() => {
        setUser(data?.value?.data.session as SessionResult);
        setCart(data?.value?.data.session.basket as Cart);
        setCategoryTree(data?.value?.data?.categories || []);
        setWishlistItemIds(data?.value?.data?.session?.basket?.itemWishListIds || []);
      });
    }

    cartLoading.value = false;
    state.value.loading = false;

    return true;
  };

  return {
    setInitialData,
    setInitialDataSSR,
    ...toRefs(state.value),
  };
};
