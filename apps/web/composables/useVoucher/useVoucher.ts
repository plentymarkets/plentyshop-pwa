import { UseVoucherReturn, UseVoucherState, DoAddCoupon, DeleteCoupon } from './types';
import { useSdk } from '~/sdk';
import { DoAddCouponParams } from '@plentymarkets/shop-api';
/**
 * @description Composable for managing products voucher.
 * @returns UseVoucherReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, getVoucher } = useVoucher();
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
    state.value.loading = true;
    const response = await useAsyncData(() => useSdk().plentysystems.doAddCoupon(params));
    state.value.loading = false;
    if (response.data.value.error) {
      const { $i18n } = useNuxtApp();
      const error = {
        status: 500,
        message: $i18n.t(`coupon.error.${response.data.value.error?.code}`),
        statusMessage: 'An error occured',
      };

      useHandleError(error);
    }
    return response.data.value.data;
  };

  const deleteCoupon: DeleteCoupon = async (params: DoAddCouponParams) => {
    state.value.loading = true;
    const response = await useAsyncData(() => useSdk().plentysystems.deleteCoupon(params));
    state.value.loading = false;
    if (response.data.value.error) {
      const { $i18n } = useNuxtApp();
      const error = {
        status: 500,
        message: $i18n.t(`coupon.error.${response.data.value.error?.code}`),
        statusMessage: 'An error occured',
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
