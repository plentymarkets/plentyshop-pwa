import { UseVoucherReturn, UseVoucherState, DoAddCoupon, DeleteCoupon } from './types';
import { useSdk } from '~/sdk';
import { DoAddCouponParams } from '@plentymarkets/shop-api';
/**
 * @description Composable for managing vouchers.
 * @returns UseVoucherReturn
 * @example
 * ``` ts
 * const { doAddCoupon, deleteCoupon, loading } = useVoucher();
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
   * doAddCoupon({
      couponCode: 'KB82AZ'
    })
   * ```
   */
  const doAddCoupon: DoAddCoupon = async (params: DoAddCouponParams) => {
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
        message: $i18n.t(`error.${getErrorCode(341)}`),
        statusMessage: $i18n.t(`error.${getErrorCode(341)}`),
      };
      useHandleError(error);
    }
    return response.data.value.data;
  };

  const deleteCoupon: DeleteCoupon = async (params: DoAddCouponParams) => {
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
        message: $i18n.t(`error.${getErrorCode(341)}`),
        statusMessage: $i18n.t(`error.${getErrorCode(341)}`),
      };

      useHandleError(error);
    }
    return response.data.value.data;
  };

  return {
    doAddCoupon,
    deleteCoupon,
    ...toRefs(state.value),
  };
};
