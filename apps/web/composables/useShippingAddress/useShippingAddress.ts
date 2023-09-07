import { Address, AddressType } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import {
  UseShippingAddressReturn,
  GetShippingAddresses,
  SaveShippingAddress,
  UseShippingAddressMethodsState,
} from './types';
import {SetDefault} from "~/composables/useBillingAddress/types";
import {userAddressGetters} from "@plentymarkets/shop-sdk";

/**
 * @description Composable for getting Shipping addresses from the current user session.
 * @example
 * const { data, loading, getShippingAddresses } = useShippingAddress();
 */

export const useShippingAddress: UseShippingAddressReturn = () => {
  const state = useState<UseShippingAddressMethodsState>('useShippingAddress', () => ({
    data: [] as Address[],
    saveAddress: null,
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

  /**
   * @description Function for fetching Shipping addresses.
   * @example
   * getShippingAddresses();
   */
  const getShippingAddresses: GetShippingAddresses = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getAddresses({
        typeId: AddressType.Shipping,
      }),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;

    getDefaultAddress();

    state.value.loading = false;
    return state.value.data;
  };

  const saveShippingAddress: SaveShippingAddress = async (address: Address) => {
    state.value.loading = true;
    state.value.saveAddress = null;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doSaveAddress({
        typeId: AddressType.Shipping,
        addressData: address,
      }),
    );
    useHandleError(error.value);
    state.value.saveAddress = data.value?.data ?? state.value.saveAddress;
    state.value.loading = false;

    await getShippingAddresses();
    return state.value.saveAddress;
  };

  const setDefault: SetDefault = async (addressId: number) => {
    state.value.loading = true;
    const { data } = await useSdk().plentysystems.setAddressAsDefault({
      typeId: AddressType.Shipping,
      addressId: addressId,
    });

    state.value.loading = false;

    await getShippingAddresses();
    return state.value.saveAddress;
  };

  const deleteAddress: SetDefault = async (addressId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.deleteAddress({
      typeId: AddressType.Shipping,
      addressId: addressId,
    });

    state.value.loading = false;

    await getShippingAddresses();
    return state.value.saveAddress;
  };

  return {
    getShippingAddresses,
    saveShippingAddress,
    setDefault,
    deleteAddress,
    ...toRefs(state.value),
  };
};
