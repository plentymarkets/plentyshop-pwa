import type { Cart, ApiError } from '@plentymarkets/shop-api';

import type { SetInitialData, UseInitialSetupReturn } from './types';

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
      setUser(data.user);
      setCart(data.basket as Cart);
    }
  } catch (error) {
    useHandleError(error as ApiError);
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
  const { setRobots } = useRobots();
  const { setInitialData } = useSiteSettings();

  cartLoading.value = true;

  try {
    const { data } = await useAsyncData(() => useSdk().plentysystems.getInit());
    if (data.value?.data) {
      setUser(data.value.data.session.user);
      setCart(data.value.data.session?.basket as Cart);
      setCategoryTree(data.value.data.categories);
      setInitialData(data.value.data.settings);
      setWishlistItemIds(Object.values(data.value.data.session?.basket?.itemWishListIds || []));
      if (data.value.data.robots) {
        setRobots(data.value.data.robots);
      }
    }
  } catch (error) {
    useHandleError(error as ApiError);
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
  return {
    setInitialData,
    setInitialDataSSR,
  };
};
