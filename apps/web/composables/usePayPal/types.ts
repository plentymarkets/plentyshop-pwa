import { Ref } from 'vue';
import { PayPalNamespace } from '@paypal/paypal-js';
import {
  PayPalCreateOrder,
  PayPalApproveOrder,
  PayPalExecutePayment,
  PayPalExecuteParams,
  PayPalCreditCardTransaction,
  PayPalCaptureOrderParams,
  PayPalConfigResponse,
} from '@plentymarkets/shop-api';

export interface UsePayPalState {
  paypalScript: PayPalNamespace | null;
  order: PayPalCreateOrder | null;
  config: PayPalConfigResponse | null;
  loading: boolean;
}

export type loadConfig = () => Promise<void>;
export type LoadScript = (currency: string) => Promise<PayPalNamespace | null>;
export type createTransaction = (fundingSource: string) => Promise<PayPalCreateOrder | null>;
export type approveOrder = (orderID: string, payerID: string) => Promise<PayPalApproveOrder | null>;
export type executeOrder = (params: PayPalExecuteParams) => Promise<PayPalExecutePayment | null>;
export type createCreditCardTransaction = () => Promise<PayPalCreditCardTransaction | null>;
export type captureOrder = (params: PayPalCaptureOrderParams) => Promise<PayPalApproveOrder | null>;

export interface UsePayPalMethods {
  loading: Readonly<Ref<boolean>>;
  loadScript: LoadScript;
  createTransaction: createTransaction;
  approveOrder: approveOrder;
  executeOrder: executeOrder;
  createCreditCardTransaction: createCreditCardTransaction;
  captureOrder: captureOrder;
  loadConfig: loadConfig;
}

export type UsePayPalMethodsReturn = () => UsePayPalMethods;
