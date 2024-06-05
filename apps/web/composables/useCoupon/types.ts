import type { DoAddCouponParams, Cart } from '@plentymarkets/shop-api';

export interface UseCouponState {
  loading: boolean;
}

export type AddCoupon = (params: DoAddCouponParams) => Promise<Cart>;
export type DeleteCoupon = (params: DoAddCouponParams) => Promise<Cart>;

export interface UseCoupon {
  loading: Readonly<Ref<boolean>>;
  addCoupon: AddCoupon;
  deleteCoupon: DeleteCoupon;
}

export type UseCouponReturn = () => UseCoupon;
