import { Cart, SessionResult } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import { useSdk } from '~/sdk';
import { SetInitialData, UseInitialSetupReturn } from './types';

/**
 * @description Composable to get initial customer and cart data
 * @returns {@link UseInitialSetupReturn}
 * @example
 * const { setInitialData } = useInitialSetup();
 */
export const useInitialSetup: UseInitialSetupReturn = () => {
  /** Function for getting current customer/cart data from session
   * @example
   * setInitialData();
   */
  const setInitialData: SetInitialData = async () => {
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getSession());
    useHandleError(error.value);

    const { setUser } = useCustomer();
    setUser(data.value?.data as SessionResult);

    const { setCart } = useCart();
    setCart(data.value?.data.basket as Cart);
  };

  return {
    setInitialData,
  };
};
