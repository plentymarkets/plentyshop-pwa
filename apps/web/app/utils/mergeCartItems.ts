import type { CartItem } from '@plentymarkets/shop-api';

/**
 * @description Takes over the cart items reported by the backend (e.g. through the
 * `backend:AfterBasketChanged` event) and keeps the item data (image, name, ...) that the
 * backend does not include for items that are already in the cart.
 * @param current The items currently in the cart.
 * @param incoming The items the backend reports.
 */
export const mergeCartItems = (current: CartItem[] = [], incoming: CartItem[] = []): CartItem[] =>
  incoming.map((incomingItem) => ({
    ...incomingItem,
    variation: incomingItem.variation ?? current.find((item) => item.id === incomingItem.id)?.variation ?? null,
  }));
