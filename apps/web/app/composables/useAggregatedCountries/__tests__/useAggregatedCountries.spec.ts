import type { ActiveShippingCountry, GeoRegulatedCountry } from '@plentymarkets/shop-api';
import { useAggregatedCountries } from '../useAggregatedCountries';
import { ActiveShippingCountryList } from './mocks/ActiveShippingCountriesMock';
import countryList from '../../../../__tests__/fixtures/postCodeMapper.json';

const Austria = ActiveShippingCountryList.find((c) => c.id === 2) as ActiveShippingCountry;
const Belgium = ActiveShippingCountryList.find((c) => c.id === 3) as ActiveShippingCountry;

describe('useAggregatedCountries', () => {
  afterEach(() => {
    clearNuxtState();
  });

  describe.each(countryList)('zip code validation: $name', ({ countryId, valid, invalid }) => {
    const country = ActiveShippingCountryList.find((c) => c.id === Number(countryId));

    it.each(valid)('should accept %s as a valid postcode', (zipCode) => {
      if (!country) return;
      const regex = useAggregatedCountries().parseZipCodeRegex(country);
      expect(regex?.test(zipCode)).toBe(true);
    });

    it.each(invalid)('should reject %s as an invalid postcode', (zipCode) => {
      if (!country) return;
      const regex = useAggregatedCountries().parseZipCodeRegex(country);
      expect(regex?.test(zipCode)).toBe(false);
    });
  });

  describe('saving countries from the API', () => {
    it('should store the default shipping countries', () => {
      const { setCountries, default: defaultCountries } = useAggregatedCountries();
      setCountries([Austria], []);
      expect(defaultCountries.value).toEqual([Austria]);
    });

    it('should store the geo-regulated countries', () => {
      const { setCountries, geoRegulated } = useAggregatedCountries();
      setCountries([], [Belgium as GeoRegulatedCountry]);
      expect(geoRegulated.value).toEqual([Belgium]);
    });
  });

  describe('looking up a country name by ID', () => {
    it('should return the display name for a known country', () => {
      const { setCountries, localeCountryName } = useAggregatedCountries();
      setCountries([Austria], []);
      expect(localeCountryName(String(Austria.id))).toBe(Austria.currLangName);
    });

    it('should return the localized name, not the default English name', () => {
      const Germany = {
        id: 1,
        name: 'Germany',
        currLangName: 'Deutschland',
        isoCode2: 'DE',
        states: [],
      } as unknown as ActiveShippingCountry;
      const { setCountries, localeCountryName } = useAggregatedCountries();
      setCountries([Germany], []);
      expect(localeCountryName('1')).toBe('Deutschland');
      expect(localeCountryName('1')).not.toBe('Germany');
    });

    it('should return an empty string for an unknown country ID', () => {
      const { localeCountryName } = useAggregatedCountries();
      expect(localeCountryName('9999')).toBe('');
    });

    it('should return an empty string when the ID is not a number', () => {
      const { localeCountryName } = useAggregatedCountries();
      expect(localeCountryName('not-a-number')).toBe('');
    });
  });

  describe('looking up a country ISO code by ID', () => {
    it('should return the lowercase ISO code for a known country', () => {
      const { setCountries, getCountryIsoCode } = useAggregatedCountries();
      setCountries([Austria], []);
      expect(getCountryIsoCode(String(Austria.id))).toBe('at');
      expect(getCountryIsoCode('9999')).toBe('');
    });
  });
});
