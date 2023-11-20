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
    const { data } = await useAsyncData(() => useSdk().plentysystems.doAddCoupon(params));
    return data.value.data;
  };

  const deleteCoupon: DeleteCoupon = async (params: DoAddCouponParams) => {
    state.value.loading = true;
    const { data } = await useAsyncData(() => useSdk().plentysystems.deleteCoupon(params));
    return data.value.data.value;
  };

  return {
    doAddCoupon,
    deleteCoupon,
    ...toRefs(state.value),
  };
};
