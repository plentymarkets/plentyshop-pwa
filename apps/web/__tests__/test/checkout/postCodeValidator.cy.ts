import postCodeMapper from '../../fixtures/postCodeMapper.json';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';

const checkout = new CheckoutPageObject();
const selectedCountry = Cypress.env('POST_CODE_VALIDATION_COUNTRY');
const countryList = selectedCountry ? postCodeMapper.filter((c) => c.name === selectedCountry) : postCodeMapper;

if (selectedCountry && countryList.length === 0) throw new Error(`Country "${selectedCountry}" not found.`);


describe('Post Code Validator', () => {
  beforeEach(() => {
    cy.clearCookies().visitSmoke().addToCart();
    checkout.goToCheckoutPath().fillContactInformationForm().useShippingAsBilling.uncheck();
  });

  // only test one case (UK, set in env) to safe test execution time
  // other zipcodes are tested in a unit test

  it('should accept valid postcodes', () => {
    countryList.forEach(({ countryId, name, valid }) => {
      valid.forEach((zipCode) => {
        cy.log('Testing valid postcode', name, zipCode);
        checkout.fillPostCodeBillingForm({ country: countryId, zipCode });
        cy.get('#billingZipCodeError').should('not.exist');
        checkout.clearPostCodeBillingForm();
      });
    });
  });

  it('should reject invalid postcodes', () => {
    countryList.forEach(({ countryId, name, invalid }) => {
      invalid.forEach((zipCode) => {
        cy.log('Testing invalid postcode', name, zipCode);
        checkout.fillPostCodeBillingForm({ country: countryId, zipCode });
        cy.get('#billingZipCodeError').should('exist');
        checkout.clearPostCodeBillingForm();
      });
    });
  });
});

