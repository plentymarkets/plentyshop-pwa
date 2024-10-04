import { PayPalNamespace } from '@paypal/paypal-js';

export const PayPalPaymentKey = 'PAYPAL';
export const PayPalCreditCardPaymentKey = 'PAYPAL_UNBRANDED_CARD';

export type PayPalScript = {
  script: PayPalNamespace | null;
  locale: string;
  currency: string;
  commit: boolean;
};

export type PayPalLoadScript = {
  [key: string]: Promise<PayPalNamespace | null>;
};
