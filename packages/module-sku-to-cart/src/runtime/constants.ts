import type { SkuToCartPosition } from './types';

/** Name the component is registered under, used to inject it into a shop area. */
export const SKU_TO_CART_COMPONENT = 'SkuToCart';

/** Shop injection area per configurable position. */
export const SKU_TO_CART_AREAS = {
  aboveCoupon: 'cart.aboveCoupon',
  belowCoupon: 'cart.belowCoupon',
} as const satisfies Record<SkuToCartPosition, string>;

/** Area under the "cart is empty" text. The coupon field is not shown in an empty cart, so the form is always added here. */
export const SKU_TO_CART_EMPTY_CART_AREA = 'cart.empty';
