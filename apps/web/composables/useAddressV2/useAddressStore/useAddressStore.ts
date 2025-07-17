import type { AddressType, Address } from '@plentymarkets/shop-api';
import type { AddressState } from './types';

export const useAddressStore = (type: AddressType) => {
  const state = useState<AddressState>('useAddressStore' + type, () => ({
    addresses: [],
  }));

  const set = (addresses: Address[]) => {
    state.value.addresses = addresses;
  };

  const create = (address: Address) => {
    state.value.addresses.push(address);
  };

  const get = (addressId: number) => {
    return state.value.addresses.find((address: Address) => address.id === addressId);
  };

  const update = (address: Address) => {
    const index = state.value.addresses.findIndex((a: Address) => a.id === address.id);
    if (index !== -1) state.value.addresses[index] = address;
  };

  const destroy = (addressId: number) => {
    state.value.addresses = state.value.addresses.filter((address: Address) => address.id !== addressId);
  };

  const clear = () => set([]);

  return {
    ...toRefs(state.value),
    set,
    create,
    get,
    update,
    destroy,
    clear,
  };
};
