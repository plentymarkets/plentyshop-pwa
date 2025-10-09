export type FraudNetState = {
  merchantId: string | null;
  fraudId: string | null;
  pageId: string;
};

export type PayUponInvoiceState = {
  loading: boolean;
  submitFirstTime: boolean;
  birthDate: string;
  validBirthDate: boolean;
  phoneWithPrefix: string;
  validPhone: boolean;
  phoneError: string;
  phoneNumber: string;
  phoneCountryCode: string;
  fraudNet: FraudNetState;
};
