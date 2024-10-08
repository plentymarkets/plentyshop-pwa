import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';
import { PlentyError } from '~/sdk.client';

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
    } catch (error: unknown) {
      useHandleError(error as PlentyError);
      state.value.loading = false;
    }
  };

  return {
    set,
    ...toRefs(state.value),
  };
};
