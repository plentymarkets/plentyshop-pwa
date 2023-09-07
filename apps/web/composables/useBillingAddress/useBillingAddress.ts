import { Address, AddressType } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
import {
  UseBillingAddressReturn,
  GetBillingAddresses,
  SaveBillingAddress,
  UseBillingAddressMethodsState, SetDefault,
} from './types';

/**
 * @description Composable for getting billing addresses from the current user session.
 * @example
 * const { data, loading, getBillingAddresses } = useBillingAddress();
 */

export const useBillingAddress: UseBillingAddressReturn = () => {
  const state = useState<UseBillingAddressMethodsState>('useBillingAddress', () => ({
    data: [] as Address[],
    saveAddress: null,
    loading: false,
  }));

  /**
   * @description Function for fetching billing addresses.
   * @example
   * getBillingAddresses();
   */
  const getBillingAddresses: GetBillingAddresses = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getAddresses({
        typeId: AddressType.Billing,
      }),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  const saveBillingAddress: SaveBillingAddress = async (address: Address) => {
    state.value.loading = true;
    state.value.saveAddress = null;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doSaveAddress({
        typeId: AddressType.Billing,
        addressData: address,
      }),
    );
    useHandleError(error.value);
    state.value.saveAddress = data.value?.data ?? state.value.saveAddress;
    state.value.loading = false;

    await getBillingAddresses();
    return state.value.saveAddress;
  };

  const setDefault: SetDefault = async (addressId: number) => {
    state.value.loading = true;
    const { data } = await useSdk().plentysystems.setAddressAsDefault({
      typeId: AddressType.Billing,
      addressId: addressId,
    });

    state.value.loading = false;

    await getBillingAddresses();
    return state.value.saveAddress;
  };

  const deleteAddress: SetDefault = async (addressId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.deleteAddress({
      typeId: AddressType.Billing,
      addressId: addressId,
    });

    state.value.loading = false;

    await getBillingAddresses();
    return state.value.saveAddress;
  };

  return {
    getBillingAddresses,
    saveBillingAddress,
    setDefault,
    deleteAddress,
    ...toRefs(state.value),
  };
};
