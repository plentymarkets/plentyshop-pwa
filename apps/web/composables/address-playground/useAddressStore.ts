import { Address } from "@plentymarkets/shop-api";


export const useAddressStore = defineStore('addressStore', () => {
    const addresses: Ref<Address[]> = ref([]);

    const deleteAddress = (addressId: number) => {
        addresses.value = addresses.value.filter((address: Address) => address.id !== addressId);
    }

    const update = (address: Address) => {
        const index = addresses.value.findIndex((a: Address) => a.id === address.id);
        if (index !== -1) {
            addresses.value[index] = address;
        }
    }

    const get = (addressId: number) => {
        return addresses.value.find((address: Address) => address.id === addressId);
    }

    return { addresses, deleteAddress, update, get };
});
