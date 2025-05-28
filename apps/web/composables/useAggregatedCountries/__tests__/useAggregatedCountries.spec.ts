import { useAggregatedCountries } from '../useAggregatedCountries';
import { ActiveShippingCountryList } from './mocks/ActiveShippingCountriesMock';
import countryList from '../../../__tests__/fixtures/postCodeMapper.json';

describe('useAggregatedCountries', () => {
  describe('parseZipCodeRegex', () => {
    countryList.forEach(({ countryId, name, valid, invalid }) => {
      describe(`${name} Post Code Validator`, () => {
        valid.forEach((zipCode) => {
          it(`accepts valid postcode: ${zipCode}`, () => {
            const country = ActiveShippingCountryList.find((country) => Number(country.id === Number(countryId)));
            if (!country) return null;
            const regex = useAggregatedCountries().parseZipCodeRegex(country);
            expect(regex?.test(zipCode)).toBe(true);
          });
        });

        invalid.forEach((zipCode) => {
          it(`rejects invalid postcode: ${zipCode}`, () => {
            const country = ActiveShippingCountryList.find((country) => Number(country.id === Number(countryId)));
            if (!country) return null;
            const regex = useAggregatedCountries().parseZipCodeRegex(country);
            expect(regex?.test(zipCode)).toBe(false);
          });
        });
      });
    });
  });
});
