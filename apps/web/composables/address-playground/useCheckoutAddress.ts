import { Address, AddressType } from '@plentymarkets/shop-api';

export const useCheckoutAddress = (type: AddressType) => {
  const state = useState('useCheckoutAddress' + type, () => ({
    checkoutAddress: {} as Address,
    loading: false,
  }));

  const setCheckoutAddress = async (address: Address) => {
    try {
      state.value.loading = true;
      await useSdk().plentysystems.setCheckoutAddress({
        typeId: type,
        addressId: Number(address.id),
      });
      state.value.loading = false;
    } catch (error: any) {
      useHandleError(error);
      state.value.loading = false;
    }
  };

  const set = (address: Address, clientOnly = false) => {
    state.value.checkoutAddress = address;
    if (clientOnly) return;
    setCheckoutAddress(address);
  };

  const clear = () => {
    state.value.checkoutAddress = {} as Address;
  };

  const hasCheckoutAddress = computed(() => {
    return Number(state.value.checkoutAddress.id) > 0;
  });

  return {
    set,
    clear,
    hasCheckoutAddress,
    ...toRefs(state.value),
  };
};
