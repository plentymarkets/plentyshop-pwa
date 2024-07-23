import { Address, AddressType } from "@plentymarkets/shop-api";

export const useAddresses = (type: AddressType) => {
    const state = useState('useAddresses' + type, () => ({
        addresses: [] as Address[],
    }));

    const set = (addresses: Address[]) => {
        state.value.addresses = addresses;
    };

    const update = (address: Address) => {
        const index = state.value.addresses.findIndex((a: Address) => a.id === address.id);
        if (index !== -1) {
            state.value.addresses[index] = address;
        }
    }

    const get = (addressId: number) => {
        return state.value.addresses.find((address: Address) => address.id === addressId);
    }

    const deleteAddress = (addressId: number) => {
        state.value.addresses = state.value.addresses.filter((address: Address) => address.id !== addressId);
    }

    const clear = () => {
        state.value.addresses = [];
    }

    return {
        ...toRefs(state),
        set,
        get,
        update,
        deleteAddress,
        clear
    }
}