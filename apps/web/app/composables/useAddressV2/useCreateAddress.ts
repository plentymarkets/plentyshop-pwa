import type { ApiError, AddressType, Address } from '@plentymarkets/shop-api';

export const useCreateAddress = (type: AddressType) => {
  const state = useState('useCreateAddress' + type, () => ({
    loading: false,
    invalidVAT: false,
    vatServerError: false,
    vatServerErrors: ['address.vatServerBusy', 'address.vatServerFallback'],
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
      state.value.invalidVAT = errorHasKeyValue(error, 'key', 'address.vatInvalid');
      if (!state.value.invalidVAT) {
        state.value.vatServerError = errorHasKeyAnyValue(error, 'key', state.value.vatServerErrors);
        useHandleError(error as ApiError);
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
