import { AddressType } from "@plentymarkets/shop-api";

export const useDeleteAddress = (type: AddressType) => {
    const state = useState('useDeleteAddress' + type, () => ({
        loading: false,
    }));

    const deleteAddress = async (addressId: number) => {
        state.value.loading = true;
        try {
            await useSdk().plentysystems.deleteAddress({
                typeId: type,
                addressId,
            });

            const { destroy } = useAddressStore(type);
            destroy(addressId);

            state.value.loading = false;
        } catch (error: any) {
            useHandleError(error);
            state.value.loading = false;
        }
    };

    return {
        deleteAddress,
        ...toRefs(state),
    }
}