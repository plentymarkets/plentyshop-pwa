import type { PayPalNamespace } from '@paypal/paypal-js';

export type PayPalVisibilityLocations = 'itemPage' | 'quickCheckout' | 'cartPage' | 'guestLoginPage' | 'checkoutPage';

export type PayPalScript = {
  script: PayPalNamespace | null;
  locale: string;
  currency: string;
  commit: boolean;
};

export type PayPalLoadScript = {
  [key: string]: Promise<PayPalNamespace | null>;
};
