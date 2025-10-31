import type { ApiError, MigrateGuestOrderToCustomerParams } from '@plentymarkets/shop-api';

export const useMigrateGuestOrder = () => {
  const state = useState('useMigrateGuestOrder', () => ({
    loading: false,
  }));

  const migrateGuestOrder = async (params: MigrateGuestOrderToCustomerParams) => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.doMigrateGuestOrderToCustomer(params);
      return !!data;
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return false;
  };

  return {
    ...toRefs(state.value),
    migrateGuestOrder,
  };
};
