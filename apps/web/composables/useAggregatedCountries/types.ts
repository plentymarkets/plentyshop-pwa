import {
  type ActiveShippingCountry,
  type GeoRegulatedCountry,
  type AggregatedCountries,
} from '@plentymarkets/shop-api';

export interface UseAggregatedCountriesState {
  default: AggregatedCountries['default'];
  geoRegulated: AggregatedCountries['geoRegulated'];
  loading: boolean;
}

export type FetchAggregatedCountries = () => Promise<void>;

export interface UseAggregatedCountries {
  default: Readonly<Ref<UseAggregatedCountriesState['default']>>;
  geoRegulated: Readonly<Ref<UseAggregatedCountriesState['geoRegulated']>>;
  loading: Readonly<Ref<boolean>>;
  fetchAggregatedCountries: FetchAggregatedCountries;
  useGeoRegulatedCountries: boolean;
  billingCountries: ComputedRef<(ActiveShippingCountry | GeoRegulatedCountry)[]>;
}

export type UseAggregatedCountriesReturn = () => UseAggregatedCountries;
