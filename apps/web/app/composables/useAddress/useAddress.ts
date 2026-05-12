import { type Address, AddressType } from '@plentymarkets/shop-api';
import type { UseAddressMethodsState, UseAddressReturn } from './types';
import { createAddressLogic } from './createAddressLogic';

/**
 * @deprecated use `useAddressStore`, `useCheckoutAddress`, `useCreateAddress`, `usePrimaryAddress`, `useFetchAddress`, `useDeleteAddress` instead
 * @description Composable for working with addresses in the current user session.
 * The composable covers two types of addresses, billing and shipping.
 * @example
 * This example uses the address type `Billing`. All examples are equivalent for addresses of type `Shipping`.
 * ``` ts
 * const {
 *  data,
 *  loading,
 *  defaultAddressId,
 *  savedAddress,
 *  getAddresses,
 *  saveAddress,
 *  deleteAddress,
 *  setDefault
 * } = useAddress(AddressType.Billing);
 * let address: Address;
 * let id: Number;
 * getAddresses();
 * saveAddress(address);
 * deleteAddress(id);
 * setDefault(id);
 * ```
 * - `getAddresses` gets all addresses of the address type passed to `useAddress`.
 * Updates `defaultAddressId` to the current default address.
 * - `saveAddress` saves the given address with the address type passed to `useAddress`.
 * If successful, it returns the `savedAddress`.
 * After saving the address, updates the list of addresses.
 * - `deleteAddress` deletes the address of the address type passed to `useAddress` with the given ID.
 * After deleting the address, updates the list of addresses.
 * - `setDefault` updates the `defaultAddressId` of the type passed to `useAddress` with the given ID.
 * After setting the default, updates the list of addresses.
 * @param type
 */

export const useAddress: UseAddressReturn = (type: AddressType, cacheKey = '') => {
  const state = useState<UseAddressMethodsState>(`useAddress-${type}${cacheKey}`, () => ({
    data: [] as Address[],
    useAsShippingAddress: true,
    loading: false,
    defaultAddressId: 0,
    defaultAddress: {} as Address,
    cartAddressId: 0,
    cartAddress: {} as Address,
    displayAddress: {} as Address,
  }));

  const { data: cart } = useCart();

  return createAddressLogic(type, state, {
    sdk: useSdk(),
    cart,
    handleError: useHandleError,
  });
};
