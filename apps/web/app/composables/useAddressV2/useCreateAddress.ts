import { type AddressType, type Address, ApiError } from '@plentymarkets/shop-api';

export const useCreateAddress = (type: AddressType) => {
  const state = useState('useCreateAddress' + type, () => ({
    loading: false,
    invalidVAT: false,
  }));

  const create = async (address: Address) => {
    try {
      state.value.loading = true;
      state.value.invalidVAT = false;
      const data = await useSdk().plentysystems.doSaveAddress({ typeId: type, addressData: address });
      useAddressStore(type).set(data.data);
      state.value.loading = false;
      return Promise.resolve(true);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        state.value.invalidVAT = error.key === 'address.vatInvalid';
        if (!state.value.invalidVAT) useHandleError(error);
      } else {
        console.error('Unknown error creating an Address: ', error);
      }
      return Promise.reject();
    } finally {
      state.value.loading = false;
    }
  };

  const clearInvalidVAT = () => (state.value.invalidVAT = false);

  return {
    create,
    clearInvalidVAT,
    ...toRefs(state.value),
  };
};
