import type { Order } from '@plentymarkets/shop-api';
import type { PayPalVisibilityLocations } from '~/composables';

export type PaypalButtonPropsType = {
  type: string;
  location?: PayPalVisibilityLocations;
  plentyOrderId?: number;
  disabled?: boolean;
  currency?: string;
};

export type PaypalAPMPropsType = {
  disabled?: boolean;
};

export type PayPalAddToCartCallback = (successfully: boolean) => void;

export type PayPalPayLaterBannerType = {
  placement: 'home' | 'product' | 'cart' | 'category' | 'payment';
  amount: number;
  location?: PayPalVisibilityLocations;
  commit?: boolean;
};

export type OrderPayload = {
  intent: string;
  purchase_units: {
    amount: { currency_code: string; value: string };
    payee: { merchant_id: string };
  }[];
};

export type PayPalApplePayErrorType = {
  name: string;
  message: string;
  paypalDebugId: null | string;
};

export type ConfigResponse = {
  isEligible: boolean;
  countryCode: string;
  merchantCountry: string;
  currencyCode: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
};

export type GQLConfigResponse = {
  isEligible: boolean;
  merchantCountry: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
};

export type ApplePaySession = {
  displayName: string;
  domainName: string;
  epochTimestamp: number;
  expiresAt: number;
  merchantIdentifier: string;
  merchantSessionIdentifier: string;
  nonce: string;
  operationalAnalyticsIdentifier: string;
  pspId: string;
  retries: number;
  signature: string;
};

export type ApplePayPaymentContact = {
  phoneNumber?: string;
  emailAddress?: string;
  givenName?: string;
  familyName?: string;
  phoneticGivenName?: string;
  phoneticFamilyName?: string;
  addressLines?: string[];
  subLocality?: string;
  locality?: string;
  postalCode?: string;
  subAdministrativeArea?: string;
  administrativeArea?: string;
  country?: string;
  countryCode?: string;
};

export type ApplePayPaymentMethodType = 'debit' | 'credit' | 'prepaid' | 'store';

export type ApplePayPaymentPassActivationState =
  | 'activated'
  | 'requiresActivation'
  | 'activating'
  | 'suspended'
  | 'deactivated';

export type ApplePayPaymentPass = {
  primaryAccountIdentifier: string;
  primaryAccountNumberSuffix: string;
  deviceAccountIdentifier?: string;
  deviceAccountNumberSuffic?: string;
  activationState: ApplePayPaymentPassActivationState;
};

// https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentmethod
export type ApplePayPaymentMethod = {
  displayName?: string;
  network?: string;
  type?: ApplePayPaymentMethodType;
  paymentPass?: ApplePayPaymentPass;
  billingContact?: ApplePayPaymentContact;
};

export type ApplePayPaymentToken = {
  paymentMethod: ApplePayPaymentMethod;
  transactionIdentifier?: string;
  paymentData?: object;
};

export type ApplePayPayment = {
  token: ApplePayPaymentToken;
  billingContact?: ApplePayPaymentContact;
  shippingContact?: ApplePayPaymentContact;
};

export type GooglePayPayerActionData = {
  paypalOrderId: string;
  paypalPayerId: string;
  orderID: string;
};

export type ConfirmOrderParams = {
  orderId: string;
  token: ApplePayPaymentToken;
  billingContact?: ApplePayPaymentContact;
  shippingContact?: ApplePayPaymentContact;
};

export type ValidateMerchantParams = {
  validationUrl: string;
  displayName?: string;
};

export type ValidateMerchantResponse = {
  merchantSession: ApplePaySession;
  paypalDebugId: null | string;
};

export type ApplepayType = {
  config(): Promise<ConfigResponse>;
  validateMerchant(argument0: ValidateMerchantParams): Promise<ValidateMerchantResponse>;
  confirmOrder(argument0: ConfirmOrderParams): Promise<void>;
};

export type GooglepayType = {
  config(): Promise<ConfigResponse>;
  validateMerchant(argument0: ValidateMerchantParams): Promise<ValidateMerchantResponse>;
  confirmOrder(argument0: ConfirmOrderParams): Promise<void>;
};

export type PayPalInvoiceDetailsProps = {
  order: Order;
};
