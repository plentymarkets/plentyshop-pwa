import { Address, AddressType } from '@plentymarkets/shop-api';

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

      const { create } = useAddressStore(type);
      create(address, data.data);

      state.value.loading = false;
    } catch (error: any) {
      useHandleError(error);
      state.value.loading = false;
    }
  };

  return {
    create,
    ...toRefs(state.value),
  };
};
