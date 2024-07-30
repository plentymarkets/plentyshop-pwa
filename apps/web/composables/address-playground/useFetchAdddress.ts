import { AddressType } from "@plentymarkets/shop-api";

export const useFetchAdddress = (type: AddressType) => {

    const state = useState('useFetchAdddress' + type, () => ({
        loading: false,
    }));

    const fetch = async () => {
        try {
            state.value.loading = true;
            const data = await useSdk().plentysystems.getAddresses({
                typeId: type,
            });
            const { set } = useAddressStore(type);
            set(data.data);
            state.value.loading = false;
        } catch (error: any) {
            useHandleError(error);
            state.value.loading = false;
        }
    };

    const fetchServer = async () => {
        state.value.loading = true;
        const { data, error } = await useAsyncData(type.toString(), () =>
            useSdk().plentysystems.getAddresses({
                typeId: type,
            }),
        );
        useHandleError(error.value);

        const { set } = useAddressStore(type);
        set(data.value?.data || []);

        state.value.loading = false;
    }
    return {
        fetch,
        fetchServer,
        ...toRefs(state.value),
    }
}