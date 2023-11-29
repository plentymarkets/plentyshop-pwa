import { Ref } from 'vue';
import { DoAddCouponParams, Cart } from '@plentymarkets/shop-api';

export interface UseVoucherState {
  loading: boolean;
}

export type AddVoucher = (params: DoAddCouponParams) => Promise<Cart>;
export type DeleteVoucher = (params: DoAddCouponParams) => Promise<Cart>;

export interface UseVoucher {
  loading: Readonly<Ref<boolean>>;
  addVoucher: AddVoucher;
  deleteVoucher: DeleteVoucher;
}

export type UseVoucherReturn = () => UseVoucher;
