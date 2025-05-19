import type { ActiveShippingCountry, AggregatedCountries, GeoRegulatedCountry } from '@plentymarkets/shop-api';
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

  const getZipCodeRegex = (countryId: number, type: AddressType): RegExp | null => {
    const countries = type === AddressType.Billing ? billingCountries.value : state.value.default;
    const country = countries.find((country: ActiveShippingCountry | GeoRegulatedCountry) => country.id === countryId);

    let pattern = country?.zipCodeRegex ?? null;
    if (pattern && pattern.startsWith('/') && pattern.endsWith('/')) pattern = pattern.slice(1, -1);

    try {
      if (typeof pattern === 'string') return new RegExp(pattern);
      return null;
    } catch (e) {
      console.error(`Invalid regex pattern: `, pattern, e);
      return null;
    }
  };

  return {
    fetchAggregatedCountries,
    useGeoRegulatedCountries,
    billingCountries,
    localeCountryName,
    getZipCodeRegex,
    ...toRefs(state.value),
  };
};
