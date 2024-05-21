import type { CustomerContactEmailParams } from '@plentymarkets/shop-api';

export interface UseCustomerContactState {
  data: null;
  loading: boolean;
}

export type DoCustomerContactMail = (params: CustomerContactEmailParams) => Promise<boolean>;

export interface UseCustomerContact {
  data: Readonly<Ref<UseCustomerContactState['data']>>;
  loading: Readonly<Ref<boolean>>;
  doCustomerContactMail: DoCustomerContactMail;
}

export type UseCustomerContactReturn = () => UseCustomerContact;
