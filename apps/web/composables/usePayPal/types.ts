import type { PayPalNamespace } from '@paypal/paypal-js';
import type {
  PayPalCreateOrder,
  PayPalApproveOrder,
  PayPalExecutePayment,
  PayPalExecuteParams,
  PayPalCreditCardTransaction,
  PayPalCaptureOrderParams,
  PayPalConfigResponse,
} from '@plentymarkets/shop-api';

export const PayPalPaymentKey = 'PAYPAL';
export const PayPalCreditCardPaymentKey = 'PAYPAL_UNBRANDED_CARD';

export type PayPalScript = {
  script: PayPalNamespace | null;
  locale: string;
  currency: string;
  commit: boolean;
};

export interface UsePayPalState {
  paypalScripts: PayPalScript[];
  order: PayPalCreateOrder | null;
  config: PayPalConfigResponse | null;
  loadedConfig: boolean;
  loading: boolean;
  isAvailable: boolean;
  isReady: boolean;
}

export type LoadConfig = () => Promise<void>;
export type GetLocale = (locale: string) => string;
export type GetScript = (currency: string, commit?: boolean) => Promise<PayPalNamespace | null>;
export type LoadScript = (currency: string, locale: string, commit?: boolean) => Promise<PayPalNamespace | null>;
export type CreateTransaction = (fundingSource: string) => Promise<PayPalCreateOrder | null>;
export type ApproveOrder = (orderID: string, payerID: string) => Promise<PayPalApproveOrder | null>;
export type ExecuteOrder = (params: PayPalExecuteParams) => Promise<PayPalExecutePayment | null>;
export type CreateCreditCardTransaction = () => Promise<PayPalCreditCardTransaction | null>;
export type CaptureOrder = (params: PayPalCaptureOrderParams) => Promise<PayPalApproveOrder | null>;

export interface UsePayPalMethods {
  loading: Readonly<Ref<boolean>>;
  isAvailable: Readonly<Ref<boolean>>;
  loadedConfig: Readonly<Ref<boolean>>;
  isReady: Readonly<Ref<boolean>>;
  createTransaction: CreateTransaction;
  approveOrder: ApproveOrder;
  executeOrder: ExecuteOrder;
  createCreditCardTransaction: CreateCreditCardTransaction;
  captureOrder: CaptureOrder;
  loadConfig: LoadConfig;
  getScript: GetScript;
}

export type UsePayPalMethodsReturn = () => UsePayPalMethods;
