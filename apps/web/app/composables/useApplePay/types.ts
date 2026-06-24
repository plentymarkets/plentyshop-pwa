import type { PayPalAddToCartCallback } from '#paypal/types';

export type ButtonClickedEmits = {
  (event: 'button-clicked', callback: PayPalAddToCartCallback): Promise<void>;
  (event: 'on-payed'): void;
};
