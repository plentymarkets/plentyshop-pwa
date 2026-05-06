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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await useAsyncData(() => useSdk().plentysystems.getInit());
    if (data.value?.data) {
      setUser(data.value.data.session.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCart(data.value.data.session?.basket as any);
      setCategoryTree(data.value.data.categories);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInitialAssetsData(data.value.data.customAssets as any || []);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await useAsyncData(() => (useSdk().plentysystems as any).getSettings?.() ?? Promise.resolve({ data: {} }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((data.value as any)?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useSiteSettings().setInitialData((data.value as any).data);
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
