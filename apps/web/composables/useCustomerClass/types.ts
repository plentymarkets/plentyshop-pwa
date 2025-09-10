import type { CustomerClass } from '@plentymarkets/shop-api';

export interface UseCustomerClassState {
  data: CustomerClass[];
  loading: boolean;
}

export type FetchCustomerClasses = () => Promise<CustomerClass[]>;

export interface UseCustomerClasses {
  data: Readonly<Ref<UseCustomerClassState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCustomerClasses: FetchCustomerClasses;
}

export type UseCustomerClassesReturn = () => UseCustomerClasses;
