import { Address, AddressType } from "@plentymarkets/shop-api"

export const useCreateAddress = (type: AddressType) => {

    const state = useState('useCreateAddress' + type, () => ({
        loading: false,
    }));

    const create = async (address: Address) => {
        try {
            state.value.loading = true;
            const data = await useSdk().plentysystems.doSaveAddress({
                typeId: type,
                addressData: address,
            });

            const { set } = useAddresses(type);
            set(data.data);

            // setDisplayAddress?
            const { set: setDisplayAddress } = useDisplayAddress(type);
            setDisplayAddress(data.data[0]);

            state.value.loading = false;
        } catch (error: any) {
            useHandleError(error);
            state.value.loading = false;
        }

        // return value? to be used in the component and setDisplayAddress?
    };

    return {
        create,
        ...toRefs(state),
    }
}