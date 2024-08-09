import { type Address, AddressType, userAddressGetters } from '@plentymarkets/shop-api';

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
    } catch (error: any) {
      useHandleError(error);
      state.value.loading = false;
    }
  };

  return {
    set,
    ...toRefs(state.value),
  };
};
