import { Address, AddressType } from "@plentymarkets/shop-api";

export const useDisplayAddress = (type: AddressType) => {
    const state = useState('useDisplayAddress' + type, () => ({
        displayAddress: {} as Address,
    }));

    const set = (address: Address) => {
        state.value.displayAddress = address;
    }

    const clear = () => {
        state.value.displayAddress = {} as Address;
    }

    const hasDisplayAddress = computed(() => {
        return state.value.displayAddress.id;
    });

    return {
        set,
        clear,
        hasDisplayAddress,
        ...toRefs(state.value),
    }
};