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
  const { setInitialData: setInitialAssetsData } = useCustomAssets();

  cartLoading.value = true;

  try {
    const { data } = await useAsyncData(() => useSdk().plentysystems.getInit({ exclude: { settings: true } }));
    if (data.value?.data) {
      setUser(data.value.data.session.user);
      setCart(data.value.data.session?.basket as Cart);
      setCategoryTree(data.value.data.categories);
      setInitialAssetsData(data.value.data.customAssets || []);
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

/** Function for fetching all settings
 * @example
 * ``` ts
 * fetchSettings();
 * ```
 */
const fetchSettings = async () => {
  try {
    const { data } = await useAsyncData(() => useSdk().plentysystems.getSettings());
    if (data.value?.data) {
      useSiteSettings().setInitialData(data.value.data);
    }
  } catch (error) {
    useHandleError(error as ApiError);
  }
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
    fetchSettings,
  };
};
