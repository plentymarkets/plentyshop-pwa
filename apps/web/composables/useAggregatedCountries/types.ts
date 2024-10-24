import { ActiveShippingCountry, GeoRegulatedCountry, type AggregatedCountries } from '@plentymarkets/shop-api';

export interface UseAggregatedCountriesState {
  data: AggregatedCountries;
  loading: boolean;
}

export type GetAggregatedCountries = () => Promise<AggregatedCountries>;

export interface UseAggregatedCountries {
  data: Readonly<Ref<UseAggregatedCountriesState['data']>>;
  loading: Readonly<Ref<boolean>>;
  useGeoRegulatedCountries: boolean;
  getAggregatedCountries: GetAggregatedCountries;
  getDefaultCountries: () => ActiveShippingCountry[];
  getGeoRegulatedCountries: () => GeoRegulatedCountry[];
}

export type UseAggregatedCountriesReturn = () => UseAggregatedCountries;
