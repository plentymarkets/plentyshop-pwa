import { Address, AddressType } from '@plentymarkets/shop-api';

export const useAddressForm = (type: AddressType) => {
  const { create } = useCreateAddress(type);

  const state = useState('useAddressForm' + type, () => ({
    isLoading: false,
    open: false,
    addressToSave: {},
  }));

  const save = async () => {
    console.log('state.value.addressToSave', state.value.addressToSave);

    if (!state.value.addressToSave) return true;
    state.value.isLoading = true;

    await create(state.value.addressToSave as Address);
    state.value.open = false;
    state.value.isLoading = false;
    return true;
  };

  return {
    save,
    ...toRefs(state.value),
  };
};
