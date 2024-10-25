import { ActiveShippingCountry, GeoRegulatedCountry, type AggregatedCountries } from '@plentymarkets/shop-api';

export interface UseAggregatedCountriesState {
  data: AggregatedCountries;
  loading: boolean;
}

export type FetchAggregatedCountries = () => Promise<AggregatedCountries>;

export interface UseAggregatedCountries {
  data: Readonly<Ref<UseAggregatedCountriesState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchAggregatedCountries: FetchAggregatedCountries;
  defaultCountries: () => ActiveShippingCountry[];
  geoRegulatedCountries: () => GeoRegulatedCountry[];
  useGeoRegulatedCountries: boolean;
}

export type UseAggregatedCountriesReturn = () => UseAggregatedCountries;
