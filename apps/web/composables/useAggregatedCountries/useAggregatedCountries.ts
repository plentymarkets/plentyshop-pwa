import type { AggregatedCountries } from '@plentymarkets/shop-api';
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

  return {
    fetchAggregatedCountries,
    useGeoRegulatedCountries,
    billingCountries,
    localeCountryName,
    ...toRefs(state.value),
  };
};
