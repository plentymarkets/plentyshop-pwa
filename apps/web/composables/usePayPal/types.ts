import type { PayPalNamespace } from '@paypal/paypal-js';
import { PayPalConfigResponse, PayPalCreateOrder } from '@plentymarkets/shop-api';

export const PayPalPaymentKey = 'PAYPAL';
export const PayPalCreditCardPaymentKey = 'PAYPAL_UNBRANDED_CARD';

export type PayPalScript = {
  script: PayPalNamespace | null;
  locale: string;
  currency: string;
  commit: boolean;
};

export interface PayPalState {
  loading: boolean;
  paypalScript: PayPalScript | null;
  loadingScripts: Record<string, Promise<PayPalNamespace | null>>;
  order: PayPalCreateOrder | null;
  config: PayPalConfigResponse | null;
  loadedConfig: boolean;
  isAvailable: boolean;
  isReady: boolean;
}
