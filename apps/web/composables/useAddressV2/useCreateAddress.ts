import type { AddressType, Address, ApiError } from '@plentymarkets/shop-api';

export const useCreateAddress = (type: AddressType) => {
  const state = useState('useCreateAddress' + type, () => ({
    loading: false,
  }));

  const create = async (address: Address) => {
    try {
      state.value.loading = true;
      const data = await useSdk().plentysystems.doSaveAddress({
        typeId: type,
        addressData: address,
      });
      useAddressStore(type).set(data.data);
      state.value.loading = false;
      return Promise.resolve(true);
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      return Promise.resolve(false);
    } finally {
      state.value.loading = false;
    }
  };

  return {
    create,
    ...toRefs(state.value),
  };
};
