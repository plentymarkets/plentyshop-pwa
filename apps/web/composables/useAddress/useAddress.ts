import { Address, AddressType } from '@plentymarkets/shop-api';
import { userAddressGetters } from '@plentymarkets/shop-sdk';
import { toRefs } from '@vueuse/shared';
import { DeleteAddress, SetDefault } from '~/composables/useAddress/types';
import { useSdk } from '~/sdk';
import { UseAddressReturn, GetAddresses, SaveAddress, UseAddressMethodsState } from './types';

/**
 * @description Composable for getting addresses from the current user session.
 * @param type {@link AddressType}
 * @example
 * const {
 * data, loading, getAddresses, defaultAddressId, saveAddress, deleteAddress, setDefault
 * } = useAddress(AddressType.Billing);
 *
 * const {
 * data, loading, getAddresses, defaultAddressId, saveAddress, deleteAddress, setDefault
 * } = useAddress(AddressType.Shipping);
 */

export const useAddress: UseAddressReturn = (type: AddressType) => {
  const state = useState<UseAddressMethodsState>(`useAddress-${type}`, () => ({
    data: [] as Address[],
    savedAddress: {} as Address,
    loading: false,
    defaultAddressId: 0,
  }));

  /**
   * @description Get the default address.
   */
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

  /**
   * @description Function for fetching addresses based on type.
   * @example
   * getAddresses();
   */
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

  /**
   * @description Save an address.
   * @param address { Address }
   * @example
   * saveAddress(address);
   */
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

  /**
   * @description Set the default address.
   * @param addressId
   * @example
   * setDefault(1);
   */
  const setDefault: SetDefault = async (addressId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.setAddressAsDefault({
      typeId: type,
      addressId: addressId,
    });

    state.value.loading = false;

    await getAddresses();
  };

  /**
   * @description Delete an address.
   * @param addressId
   * @example
   * deleteAddress(1);
   */
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
