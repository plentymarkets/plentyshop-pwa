import type { MigrateGuestOrderToCustomerParams } from '@plentymarkets/shop-api';

export const useMigrateGuestOrder = () => {
  const state = useState('useMigrateGuestOrder', () => ({
    loading: false,
  }));

  const migrateGuestOrder = async (params: MigrateGuestOrderToCustomerParams) => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doMigrateGuestOrderToCustomer(params));
    useHandleError(error.value);

    state.value.loading = false;
    return !!data;
  };

  return {
    ...toRefs(state.value),
    migrateGuestOrder,
  };
};
