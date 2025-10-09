export interface GooglePayConfig {
  merchantInfo: google.payments.api.MerchantInfo;
  isEligible: boolean;
  countryCode: string;
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: google.payments.api.PaymentMethodSpecification[];
  transactionInfo: google.payments.api.TransactionInfo;
  callbackIntents: google.payments.api.CallbackIntent[];
}

export interface GooglePayConfirmOrderParams {
  orderId: string;
  paymentMethodData: google.payments.api.PaymentMethodData;
}

export interface GooglePayConfirmOrderResponse {
  status: string;
}

export interface GooglePayPayPal {
  config(): Promise<GooglePayConfig>;
  confirmOrder(params: GooglePayConfirmOrderParams): Promise<GooglePayConfirmOrderResponse>;
  initiatePayerAction(params: { orderId: string }): Promise<void>;
}
