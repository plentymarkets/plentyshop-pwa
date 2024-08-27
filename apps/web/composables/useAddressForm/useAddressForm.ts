import { Address, AddressType } from '@plentymarkets/shop-api';

export const useAddressForm = (type: AddressType) => {
  const { create } = useCreateAddress(type);

  const state = useState('useAddressForm' + type, () => ({
    isLoading: false,
    add: false,
    open: false,
    addressToSave: {} as Address,
    addressToEdit: {} as Address,
  }));

  const setInitialState = () => {
    state.value.isLoading = false;
    state.value.add = false;
    state.value.open = false;
    state.value.addressToSave = {} as Address;
    state.value.addressToEdit = {} as Address;
  };

  const save = async () => {
    if (!state.value.addressToSave) return true;
    state.value.isLoading = true;

    await create(state.value.addressToSave as Address);
    state.value.open = false;
    state.value.isLoading = false;
    return true;
  };

  return {
    setInitialState,
    save,
    ...toRefs(state.value),
  };
};
