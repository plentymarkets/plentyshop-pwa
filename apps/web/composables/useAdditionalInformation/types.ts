import type { AdditionalInformationParams } from '@plentymarkets/shop-api';

export interface UseAdditionalInformationState {
  data: null;
  loading: boolean;
  shippingPrivacyAgreement: boolean;
  customerWish: string;
  showErrors: boolean;
}

export type DoAdditionalInformation = (params: AdditionalInformationParams) => Promise<null>;

export type SetShippingPrivacyAgreement = (shippingPrivacyAgreement: boolean) => void;

export type SetShippingPrivacyAgreementErrors = (showErrors: boolean) => void;

export type setCustomerWish = (customerWish: string) => void;

export interface UseAdditionalInformation {
  data: Readonly<Ref<UseAdditionalInformationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  shippingPrivacyAgreement: Readonly<Ref<boolean>>;
  customerWish: Readonly<Ref<UseAdditionalInformationState['customerWish']>>;
  showErrors: Readonly<Ref<boolean>>;
  doAdditionalInformation: DoAdditionalInformation;
  setShippingPrivacyAgreement: SetShippingPrivacyAgreement;
  setShippingPrivacyAgreementErrors: SetShippingPrivacyAgreementErrors;
  setCustomerWish: setCustomerWish;
}
export type DoAdditionalInformationReturn = () => UseAdditionalInformation;
