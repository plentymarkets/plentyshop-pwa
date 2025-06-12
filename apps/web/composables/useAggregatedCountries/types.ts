import type {
  ActiveShippingCountry,
  GeoRegulatedCountry,
  AggregatedCountries,
  AddressType,
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
  localeCountryName: (countryId: string) => string;
  getCountryZipCodeRegex: (countryId: number, type: AddressType) => RegExp | null;
  parseZipCodeRegex(country: ActiveShippingCountry | GeoRegulatedCountry): RegExp | null;
  getCountryIsoCode: (countryId: string) => string;
}

export type UseAggregatedCountriesReturn = () => UseAggregatedCountries;
