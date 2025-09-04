import type { CustomerClassResponse } from '@plentymarkets/shop-api';

export type CustomerClassOption = { id: string; name: string };

export interface UseCustomerClassState {
  data: CustomerClassResponse | null;
  loading: boolean;
}

export type FetchCustomerClasses = () => Promise<CustomerClassResponse | null>;

export interface UseCustomerClasses {
  data: Readonly<Ref<UseCustomerClassState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCustomerClasses: FetchCustomerClasses;
}

export type UseCustomerClassesReturn = () => UseCustomerClasses;