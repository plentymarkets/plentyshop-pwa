import postCodeMapper from '../../fixtures/postCodeMapper.json';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

const selectedCountry = Cypress.env('POST_CODE_VALIDATION_COUNTRY');
const countryList = selectedCountry ? postCodeMapper.filter((c) => c.name === selectedCountry) : postCodeMapper;

if (selectedCountry && countryList.length === 0) throw new Error(`Country "${selectedCountry}" not found.`);

beforeEach(() => {
  cy.clearCookies();
  cy.visitAndHydrate(paths.home);
  homePage.goToCategory();
  productListPage.addToCart();
  cart.openCart();
  checkout.goToCheckout().goToGuestCheckout().fillContactInformationForm().useShippingAsBilling.uncheck();
});

countryList.forEach(({ countryId, name, valid, invalid }) => {
  describe(`${name} Postcode Validator`, () => {
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
