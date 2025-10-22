import type { AdditionalInformationParams } from '@plentymarkets/shop-api';

export interface UseAdditionalInformationState {
  data: null;
  loading: boolean;
  shippingPrivacyAgreement: boolean;
  customerWish: string | null;
  customerSign: string | null;
  showErrors: boolean;
}

export type DoAdditionalInformation = (params: AdditionalInformationParams) => Promise<boolean>;

export type SetShippingPrivacyAgreement = (shippingPrivacyAgreement: boolean) => void;

export type SetShippingPrivacyAgreementErrors = (showErrors: boolean) => void;

export type setCustomerWish = (customerWish: string | null) => void;

export type setCustomerSign = (customerSign: string | null) => void;

export interface UseAdditionalInformation {
  data: Readonly<Ref<UseAdditionalInformationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  shippingPrivacyAgreement: Readonly<Ref<boolean>>;
  customerWish: Readonly<Ref<UseAdditionalInformationState['customerWish']>>;
  customerSign: Readonly<Ref<UseAdditionalInformationState['customerSign']>>;
  showErrors: Readonly<Ref<boolean>>;
  doAdditionalInformation: DoAdditionalInformation;
  setShippingPrivacyAgreement: SetShippingPrivacyAgreement;
  setShippingPrivacyAgreementErrors: SetShippingPrivacyAgreementErrors;
  setCustomerWish: setCustomerWish;
  setCustomerSign: setCustomerSign;
}
export type DoAdditionalInformationReturn = () => UseAdditionalInformation;
