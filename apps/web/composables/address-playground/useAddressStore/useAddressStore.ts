import { Address, AddressType } from "@plentymarkets/shop-api";
import { EventEmitter } from "events";
import { AddressCreateEvent, AddressDestroyEvent, AddressSetEvent, AddressState, AddressUpdateEvent } from "./types";

const eventEmitter = new EventEmitter();

const emit = (event: string, payload: any, state: AddressState) => {
    eventEmitter.emit(event, { event, payload, state });
}

export const useAddressStore = ((type: AddressType) => {

    const state = useState<AddressState>('useAddressStore' + type, () => ({
        addresses: []
    }));

    const EVENTS = {
        SET: `addressStore.${type}.set`,
        CREATE: `addressStore.${type}.create`,
        DESTROY: `addressStore.${type}.destroy`,
        UPDATE: `addressStore.${type}.update`,
    }

    const set = (addresses: Address[]) => {
        state.value.addresses = addresses;
        emit(EVENTS.SET, addresses, state.value);
    }

    const create = (payload: Address, addresses: Address[]) => {
        state.value.addresses = addresses;
        emit(EVENTS.CREATE, payload, state.value);
    }

    const get = (addressId: number) => {
        return state.value.addresses.find((address: Address) => address.id === addressId);
    }

    const update = (address: Address) => {
        const index = state.value.addresses.findIndex((a: Address) => a.id === address.id);
        if (index !== -1) {
            state.value.addresses[index] = address;
            emit(EVENTS.UPDATE, address, state.value);
        }
    }

    const destroy = (addressId: number) => {
        state.value.addresses = state.value.addresses.filter((address: Address) => address.id !== addressId);
        emit(EVENTS.DESTROY, addressId, state.value);
    }

    const clear = () => {
        set([]);
    }

    const unsubscribeAll = () => {
        eventEmitter.removeAllListeners();
    }

    const onSet = (listener: (event: AddressSetEvent) => void) => {
        eventEmitter.on(EVENTS.SET, listener);
        return () => eventEmitter.off(EVENTS.SET, listener);
    }

    const onCreate = (listener: (event: AddressCreateEvent) => void) => {
        eventEmitter.on(EVENTS.CREATE, listener);
        return () => eventEmitter.off(EVENTS.CREATE, listener);
    }

    const onUpdate = (listener: (event: AddressUpdateEvent) => void) => {
        eventEmitter.on(EVENTS.UPDATE, listener);
        return () => eventEmitter.off(EVENTS.UPDATE, listener);
    }

    const onDestroy = (listener: (event: AddressDestroyEvent) => void) => {
        eventEmitter.on(EVENTS.DESTROY, listener);
        return () => eventEmitter.off(EVENTS.DESTROY, listener);
    }

    return { ...toRefs(state.value), set, create, get, update, destroy, onSet, onCreate, onDestroy, onUpdate, clear, unsubscribeAll };
});
