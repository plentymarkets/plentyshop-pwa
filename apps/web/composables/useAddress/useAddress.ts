import { Address, AddressType } from '@plentymarkets/shop-api';
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { toRefs } from '@vueuse/shared';
import { DeleteAddress, SetDefault } from '~/composables/useAddress/types';

import { UseAddressReturn, GetAddresses, SaveAddress, UseAddressMethodsState } from './types';

/**
 * @description Composable for working with addresses in the current user session.
 * The composable covers two types of addresses, billing and shipping.
 * @param {@link AddressType}
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
 */

export const useAddress: UseAddressReturn = (type: AddressType) => {
  const state = useState<UseAddressMethodsState>(`useAddress-${type}`, () => ({
    data: [] as Address[],
    savedAddress: {} as Address,
    loading: false,
    defaultAddressId: 0,
  }));

  const getDefaultAddress = (): void => {
    state.value.loading = true;

    const addresses = state.value.data;

    if (addresses.length > 0) {
      const defaultAddress = userAddressGetters.getDefault(addresses) || userAddressGetters.getAddresses(addresses)[0];

      if (defaultAddress) {
        state.value.defaultAddressId = Number(userAddressGetters.getId(defaultAddress));
      }
    }

    state.value.loading = false;
  };

  const getAddresses: GetAddresses = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(type.toString(), () =>
      useSdk().plentysystems.getAddresses({
        typeId: type,
      }),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;

    getDefaultAddress();

    state.value.loading = false;
    return state.value.data;
  };

  const saveAddress: SaveAddress = async (address: Address) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(type.toString(), () =>
      useSdk().plentysystems.doSaveAddress({
        typeId: type,
        addressData: address,
      }),
    );
    useHandleError(error.value);
    state.value.savedAddress = data.value?.data ?? state.value.savedAddress;
    state.value.loading = false;

    await getAddresses();
    return state.value.savedAddress;
  };

  const setDefault: SetDefault = async (addressId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.setAddressAsDefault({
      typeId: type,
      addressId: addressId,
    });

    state.value.loading = false;

    await getAddresses();
  };

  const deleteAddress: DeleteAddress = async (addressId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.deleteAddress({
      typeId: type,
      addressId: addressId,
    });

    state.value.loading = false;

    await getAddresses();
  };

  return {
    getAddresses,
    saveAddress,
    setDefault,
    deleteAddress,
    ...toRefs(state.value),
  };
};
