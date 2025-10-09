import type { AddressType, Address, ApiError } from '@plentymarkets/shop-api';
import { userAddressGetters } from '@plentymarkets/shop-api';

export const usePrimaryAddress = (type: AddressType) => {
  const state = useState('usePrimaryAddress' + type, () => ({
    loading: false,
    primaryAddressId: -1,
  }));

  const set = async (address: Address) => {
    state.value.loading = true;
    try {
      await useSdk().plentysystems.doSaveAddress({
        typeId: type,
        addressData: address,
      });
      state.value.primaryAddressId = Number(userAddressGetters.getId(address));
      state.value.loading = false;
      return Promise.resolve(true);
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
      return Promise.reject();
    }
  };

  return {
    set,
    ...toRefs(state.value),
  };
};
