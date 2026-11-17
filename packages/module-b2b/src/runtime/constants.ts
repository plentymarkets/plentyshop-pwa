import type { SkuToCartPosition } from './types';

/** Name of the site setting (and runtime config key) that stores the position. */
export const SKU_TO_CART_POSITION_SETTING = 'skuToCartPosition';

export const SKU_TO_CART_DEFAULT_POSITION: SkuToCartPosition = 'aboveCoupon';

export const SKU_TO_CART_POSITIONS: SkuToCartPosition[] = ['none', 'aboveCoupon', 'belowCoupon'];

/** Names the components are registered under, used to inject them into the shop areas. */
export const SKU_TO_CART_COMPONENTS = {
  aboveCoupon: 'SkuToCartAboveCoupon',
  belowCoupon: 'SkuToCartBelowCoupon',
  emptyCart: 'SkuToCartEmptyCart',
} as const;

/** Shop injection areas the components are rendered in. */
export const SKU_TO_CART_AREAS = {
  aboveCoupon: 'cart.aboveCoupon',
  belowCoupon: 'cart.belowCoupon',
  // The coupon field is not shown in an empty cart, so the form is placed under the "cart is empty" text.
  emptyCart: 'cart.empty',
} as const;
