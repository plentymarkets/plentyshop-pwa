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

countryList.forEach(({ countryId, name, valid, invalid }) => {
  describe(`${name} Post Code Validator`, () => {
    valid.forEach((zipCode) => {
      it(`accepts valid postcode: ${zipCode}`, () => {
        checkout.fillPostCodeBillingForm({ country: countryId, zipCode });
        cy.get('#billingZipCodeError').should('not.exist');
      });
    });

    invalid.forEach((zipCode) => {
      it(`rejects invalid postcode: ${zipCode}`, () => {
        checkout.fillPostCodeBillingForm({ country: countryId, zipCode });
        cy.get('#billingZipCodeError').should('exist');
      });
    });
  });
});
