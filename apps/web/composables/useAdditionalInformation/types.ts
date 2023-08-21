import type { Ref } from 'vue';
import type { AdditionalInformationParams } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export interface UseAdditionalInformationState {
  data: null;
  loading: boolean;
  shippingPrivacyAgreement: boolean;
}

export type DoAdditionalInformation = (params: AdditionalInformationParams) => Promise<null>;

export type SetShippingPrivacyAgreement = (shippingPrivacyAgreement: boolean) => Promise<void>;

export interface UseAdditionalInformation {
  data: Readonly<Ref<UseAdditionalInformationState['data']>>;
  loading: Readonly<Ref<boolean>>;
  shippingPrivacyAgreement: Readonly<Ref<boolean>>;
  doAdditionalInformation: DoAdditionalInformation;
  setShippingPrivacyAgreement: SetShippingPrivacyAgreement;
}

export type DoAdditionalInformationReturn = () => UseAdditionalInformation;
