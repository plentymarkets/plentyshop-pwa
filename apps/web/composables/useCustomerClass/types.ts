import type { GetOrdersResponse, UseUserOrderSearchParams } from '@plentymarkets/shop-api';

export interface UseCustomerClassState {
  // data: GetCustomerClassesResponse | null;
  data:  object;
  loading: boolean;
}

// export type FetchCustomerClasses = () => Promise<GetCustomerClassesResponse | null>;
export type FetchCustomerClasses = () => Promise<null>;

export interface UseCustomerClasses {
  data: Readonly<Ref<UseCustomerClassState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchCustomerClasses: FetchCustomerClasses;
}

export type UseCustomerClassesReturn = () => UseCustomerClasses;