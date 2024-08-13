import { Address, AddressType } from '@plentymarkets/shop-api';
import { AddressState } from './types';

export const useAddressStore = (type: AddressType) => {
  const state = useState<AddressState>('useAddressStore' + type, () => ({
    addresses: [],
  }));

  const set = (addresses: Address[]) => {
    state.value.addresses = addresses;
  };

  const create = (payload: Address, addresses: Address[]) => {
    state.value.addresses = addresses;
  };

  const get = (addressId: number) => {
    return state.value.addresses.find((address: Address) => address.id === addressId);
  };

  const update = (address: Address) => {
    const index = state.value.addresses.findIndex((a: Address) => a.id === address.id);
    if (index !== -1) {
      state.value.addresses[index] = address;
    }
  };

  const destroy = (addressId: number) => {
    state.value.addresses = state.value.addresses.filter((address: Address) => address.id !== addressId);
  };

  const clear = () => {
    set([]);
  };

  // const onSet = (listener: (event: AddressSetEvent) => void) => {
  //   eventEmitter.on(EVENTS.SET, listener);
  //   return () => eventEmitter.off(EVENTS.SET, listener);
  // };

  // const onCreate = (listener: (event: AddressCreateEvent) => void) => {
  //   eventEmitter.on(EVENTS.CREATE, listener);
  //   return () => eventEmitter.off(EVENTS.CREATE, listener);
  // };

  // const onUpdate = (listener: (event: AddressUpdateEvent) => void) => {
  //   eventEmitter.on(EVENTS.UPDATE, listener);
  //   return () => eventEmitter.off(EVENTS.UPDATE, listener);
  // };

  // const onDestroy = (listener: (event: AddressDestroyEvent) => void) => {
  //   eventEmitter.on(EVENTS.DESTROY, listener);
  //   return () => eventEmitter.off(EVENTS.DESTROY, listener);
  // };

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
