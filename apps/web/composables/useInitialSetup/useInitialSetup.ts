import type { Cart, SessionResult } from '@plentymarkets/shop-api';

import type { SetInitialData, UseInitialSetupReturn, UseInitialSetupState } from './types';
import type { ErrorParams } from '../useHandleError';

/** Function for getting current customer/cart data from session
 * @return SetInitialData
 * @example
 * ``` ts
 * setInitialData();
 * ```
 */
const setInitialData: SetInitialData = async () => {
  const { setUser } = useCustomer();
  const { setCart, loading: cartLoading } = useCart();

  cartLoading.value = true;

  try {
    const { data } = await useSdk().plentysystems.getSession();
    if (data) {
      setUser(data as SessionResult);
      setCart(data.basket as Cart);
    }
  } catch (error) {
    useHandleError(error as ErrorParams);
  } finally {
    cartLoading.value = false;
  }

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
  const { setUser } = useCustomer();
  const { setCategoryTree } = useCategoryTree();
  const { setCart, loading: cartLoading } = useCart();
  const { setWishlistItemIds } = useWishlist();

  cartLoading.value = true;

  try {
    const { data } = await useSdk().plentysystems.getInit();
    if (data) {
      setUser(data.session as SessionResult);
      setCart(data.session?.basket as Cart);
      setCategoryTree(data.categories);
      setWishlistItemIds(data?.session?.basket?.itemWishListIds || []);
    }
  } catch (error) {
    useHandleError(error as ErrorParams);
  } finally {
    cartLoading.value = false;
  }

  return true;
};

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
  }));

  return {
    setInitialData,
    setInitialDataSSR,
    ...toRefs(state.value),
  };
};
