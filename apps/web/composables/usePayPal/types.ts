import type { PayPalNamespace } from '@paypal/paypal-js';

export const PayPalPaymentKey = 'PAYPAL';
export const PayPalCreditCardPaymentKey = 'PAYPAL_UNBRANDED_CARD';

export const PayPalGooglePayKey = 'PAYPAL_GOOGLE_PAY';

export const PayPalApplePayKey = 'PAYPAL_APPLE_PAY';

export const PayPalPayUponInvoiceKey = 'PAYPAL_PAY_UPON_INVOICE';

export type PayPalScript = {
  script: PayPalNamespace | null;
  locale: string;
  currency: string;
  commit: boolean;
};

export type PayPalLoadScript = {
  [key: string]: Promise<PayPalNamespace | null>;
};
