import type { Cart, SessionResult } from '@plentymarkets/shop-api';

import type { SetInitialData, UseInitialSetupReturn } from './types';
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
  const { setWishlistItemIds, setWishlistVariationIds } = useWishlist();

  cartLoading.value = true;

  try {
    const { data } = await useAsyncData(() => useSdk().plentysystems.getInit());
    if (data.value?.data) {
      setUser(data.value.data.session as SessionResult);
      setCart(data.value.data.session?.basket as Cart);
      setCategoryTree(data.value.data.categories);
      const wishlistIdsFromSession = data.value.data.session?.basket?.itemWishListIds || [];
      const wishlistIdsJSON = JSON.parse(
          JSON.stringify(wishlistIdsFromSession)
      );
      const wishlistIds = [];
      const wishlistVariationIds = [];
      for (let i = 0; i < wishlistIdsJSON.length; i++) {
        wishlistIds.push(wishlistIdsJSON[i].variationId);
        wishlistVariationIds.push(wishlistIdsJSON[i]);
      }
      setWishlistItemIds(wishlistIds || []);
      setWishlistVariationIds(wishlistVariationIds || []);
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
  return {
    setInitialData,
    setInitialDataSSR,
  };
};
