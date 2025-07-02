import type { AddressType, Address, ApiError } from '@plentymarkets/shop-api';

export const useCreateAddress = (type: AddressType) => {
  const state = useState('useCreateAddress' + type, () => ({
    loading: false,
  }));

  const create = async (address: Address) => {
    try {
      state.value.loading = true;
      console.log('Saved address:', address);
      const data = await useSdk().plentysystems.doSaveAddress({
        typeId: type,
        addressData: address,
      });
      useAddressStore(type).set(data.data);
      state.value.loading = false;
      return Promise.resolve(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (Number(apiError?.code) === 1400) {
        return Promise.reject(new Error(getErrorCode(apiError.code)));
      } else {
        useHandleError(error as ApiError);
        return Promise.reject(new Error('Failed to create address'));
      }
    } finally {
      state.value.loading = false;
    }
  };

  return {
    create,
    ...toRefs(state.value),
  };
};
