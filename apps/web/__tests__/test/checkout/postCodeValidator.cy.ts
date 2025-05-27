import postCodeMapper from '../../fixtures/postCodeMapper.json';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';

const checkout = new CheckoutPageObject();
const selectedCountry = Cypress.env('POST_CODE_VALIDATION_COUNTRY');
const countryList = selectedCountry ? postCodeMapper.filter((c) => c.name === selectedCountry) : postCodeMapper;

if (selectedCountry && countryList.length === 0) throw new Error(`Country "${selectedCountry}" not found.`);

beforeEach(() => {
  cy.clearCookies().visitSmoke().addToCart();
  checkout.goToCheckoutPath().fillContactInformationForm().useShippingAsBilling.uncheck();
});

// only test one case to safe test execution time other zipcodes are tested in a unit test
describe('Post Code validator GB', () => {
  it('should acccept valid GB post code', () => {
    const gb = countryList.find((country) => country.countryId === '12');
    checkout.fillPostCodeBillingForm({ country: gb?.countryId, zipCode: gb?.valid[0] });
    cy.get('#billingZipCodeError').should('not.exist');
  })

  it('should fail on invalid GB post code', () => {
    const gb = countryList.find((country) => country.countryId === '12');
    checkout.fillPostCodeBillingForm({ country: gb?.countryId, zipCode: gb?.invalid[0] });
    cy.get('#billingZipCodeError').should('exist');
  })
})
