import { UseVoucherReturn, UseVoucherState, AddVoucher, DeleteVoucher } from './types';
import { useSdk } from '~/sdk';
import { DoAddCouponParams } from '@plentymarkets/shop-api';
/**
 * @description Composable for managing vouchers.
 * @returns UseVoucherReturn
 * @example
 * ``` ts
 * const { addVoucher, deleteVoucher, loading } = useVoucher();
 * ```
 */
export const useVoucher: UseVoucherReturn = () => {
  const state = useState<UseVoucherState>('voucher', () => ({
    loading: false,
  }));

  /**
   * @description Function for adding a voucher to curent cart.
   * @param params { DoAddCouponParams }
   * @return Cart
   * @example
   * ``` ts
   * addVoucher({
      couponCode: 'KB82AZ'
    })
   * ```
   */
  const addVoucher: AddVoucher = async (params: DoAddCouponParams) => {
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { getCart } = useCart();
    state.value.loading = true;
    const response = await useAsyncData(() => useSdk().plentysystems.doAddCoupon(params));
    state.value.loading = false;
    if (response.data.value.data) {
      getCart();
      send({ message: $i18n.t('coupon.voucherApplied'), type: 'positive' });
    } else if (response.data.value.error) {
      const error = {
        status: 500,
        message: $i18n.t(`error.${getErrorCode(response.data.value.error.code)}`),
        statusMessage: $i18n.t(`error.${getErrorCode(response.data.value.error.code)}`),
      };
      useHandleError(error);
    }
    return response.data.value.data;
  };

  const deleteVoucher: DeleteVoucher = async (params: DoAddCouponParams) => {
    state.value.loading = true;
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const { getCart } = useCart();

    const response = await useAsyncData(() => useSdk().plentysystems.deleteCoupon(params));
    state.value.loading = false;
    if (response.data.value.data) {
      getCart();
      send({ message: $i18n.t('coupon.voucherRemoved'), type: 'positive' });
    } else if (response.data.value.error) {
      const error = {
        status: 500,
        message: $i18n.t(`error.errorActionIsNotExecuted`),
        statusMessage: $i18n.t(`error.errorActionIsNotExecuted`),
      };

      useHandleError(error);
    }
    return response.data.value.data;
  };

  return {
    addVoucher,
    deleteVoucher,
    ...toRefs(state.value),
  };
};
