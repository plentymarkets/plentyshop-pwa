import type { AddressType, ApiError } from '@plentymarkets/shop-api';

export const useDeleteAddress = (type: AddressType) => {
  const state = useState('useDeleteAddress' + type, () => ({
    loading: false,
  }));

  const deleteAddress = async (addressId: number) => {
    state.value.loading = true;
    try {
      useAddressStore(type).destroy(addressId);
      await useSdk().plentysystems.deleteAddress({
        typeId: type,
        addressId,
      });

      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
    }
  };

  return {
    deleteAddress,
    ...toRefs(state.value),
  };
};
