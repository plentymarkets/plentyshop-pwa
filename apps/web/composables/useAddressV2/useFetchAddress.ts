import type { AddressType, ApiError } from '@plentymarkets/shop-api';

export const useFetchAddress = (type: AddressType) => {
  const state = useState('useFetchAddress' + type, () => ({
    loading: false,
  }));

  const { set: setAddressStore } = useAddressStore(type);

  const fetch = async () => {
    try {
      state.value.loading = true;
      const data = await useSdk().plentysystems.getAddresses({ typeId: type });
      setAddressStore(data.data);
      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
    }
  };

  const fetchServer = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(type.toString(), () =>
      useSdk().plentysystems.getAddresses({ typeId: type }),
    );

    useHandleError(error.value);
    setAddressStore(data.value?.data || []);

    if (data.value?.data?.length) {
      usePrimaryAddress(type).primaryAddressId.value = data.value?.data.find((item) => item.primary === true)?.id || -1;
    }

    state.value.loading = false;
  };

  return {
    fetch,
    fetchServer,
    ...toRefs(state.value),
  };
};
