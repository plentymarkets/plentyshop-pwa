import type {
  ActiveShippingCountry,
  AggregatedCountries,
  ApiError,
  GeoRegulatedCountry,
} from '@plentymarkets/shop-api';
import { AddressType } from '@plentymarkets/shop-api';
import type { UseAggregatedCountriesState, UseAggregatedCountriesReturn, FetchAggregatedCountries } from './types';

/**
 * @description Composable for getting `AggregatedCountries`:
 * - Default shipping countries
 * - EU geo-regulated countries
 * - A combined list of countries
 *
 * @example
 * ``` ts
 * const {
 *  default,
 *  geoRegulated,
 *  loading,
 *  fetchAggregatedCountries,
 *  useGeoRegulatedCountries,
 *  billingCountries,
 *  localeCountryName(countryId),
 * } = useAggregatedCountries();
 * ```
 */
export const useAggregatedCountries: UseAggregatedCountriesReturn = () => {
  const state = useState<UseAggregatedCountriesState>('useAggregatedCountries', () => ({
    default: [] as AggregatedCountries['default'],
    geoRegulated: [] as AggregatedCountries['geoRegulated'],
    loading: false,
  }));

  const fetchAggregatedCountries: FetchAggregatedCountries = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('getAggregatedCountries', () =>
      useSdk().plentysystems.getAggregatedCountries(),
    );

    useHandleError(error.value);

    if (data.value?.data) {
      state.value.default = data.value.data.default;
      state.value.geoRegulated = data.value.data.geoRegulated;
    }

    state.value.loading = false;
  };

  const useGeoRegulatedCountries = state.value.geoRegulated.length > 0;

  const billingCountries = computed(() => {
    if (!useGeoRegulatedCountries) return state.value.default;

    const uniqueCountries = new Map(
      [...state.value.default, ...state.value.geoRegulated].map((country) => [country.id, country]),
    );

    return [...uniqueCountries.values()].sort((firstCountry, secondCountry) =>
      firstCountry.currLangName.localeCompare(secondCountry.currLangName, useNuxtApp().$i18n.locale.value),
    );
  });

  const localeCountryName = (countryId: string) => {
    const id = Number.parseInt(countryId);

    if (Number.isNaN(id)) return '';
    return billingCountries.value.find((country) => country.id === id)?.currLangName ?? '';
  };

  const parseZipCodeRegex = (country: ActiveShippingCountry | GeoRegulatedCountry) => {
    let pattern = country?.zipCodeRegex ?? null;

    try {
      if (typeof pattern !== 'string') return null;
      let flags = '';

      if (pattern.startsWith('/') && pattern.endsWith('/i')) {
        pattern = pattern.slice(1, -2);
        flags = 'i';
      } else if (pattern.startsWith('/') && pattern.endsWith('/')) {
        pattern = pattern.slice(1, -1);
      }

      return new RegExp(pattern, flags);
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      return null;
    }
  };

  const getCountryZipCodeRegex = (countryId: number, type: AddressType): RegExp | null => {
    const countries = type === AddressType.Billing ? billingCountries.value : state.value.default;
    const country = countries.find((country: ActiveShippingCountry | GeoRegulatedCountry) => country.id === countryId);
    if (!country) return null;
    return parseZipCodeRegex(country);
  };

  return {
    parseZipCodeRegex,
    fetchAggregatedCountries,
    useGeoRegulatedCountries,
    billingCountries,
    localeCountryName,
    getCountryZipCodeRegex,
    ...toRefs(state.value),
  };
};
