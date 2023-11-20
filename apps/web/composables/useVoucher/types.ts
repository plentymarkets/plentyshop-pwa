import { Ref } from 'vue';
import { DoAddCouponParams, Cart } from '@plentymarkets/shop-api';

export interface UseVoucherState {
  loading: boolean;
}

export type DoAddCoupon = (params: DoAddCouponParams) => Promise<Cart>;
export type DeleteCoupon = (params: DoAddCouponParams) => Promise<Cart>;

export interface UseVoucher {
  loading: Readonly<Ref<boolean>>;
  doAddCoupon: DoAddCoupon;
  deleteCoupon: DeleteCoupon;
}

export type UseVoucherReturn = () => UseVoucher;
