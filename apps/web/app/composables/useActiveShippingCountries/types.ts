import type { ActiveShippingCountry } from '@plentymarkets/shop-api';

export interface UseActiveShippingCountriesState {
  data: ActiveShippingCountry[];
  loading: boolean;
}

export type GetActiveShippingCountries = () => Promise<ActiveShippingCountry[]>;

export interface UseActiveShippingCountries {
  data: Readonly<Ref<UseActiveShippingCountriesState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getActiveShippingCountries: GetActiveShippingCountries;
}

export type UseActiveShippingCountriesReturn = () => UseActiveShippingCountries;
