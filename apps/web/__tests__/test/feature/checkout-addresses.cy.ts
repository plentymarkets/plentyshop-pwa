import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie('consent-cookie', '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}');
  cy.visitAndHydrate(paths.home);
});

describe('Checkout Addresses', () => {
  it('should display same as shipping text if a guest creates his shipping address with billing same as shipping checked', () => {
    homePage.goToCategory();
    productListPage.addToCart()

    cart.openCart();
    checkout
        .goToCheckout()
        .goToGuestCheckout()
        .fillContactInformationForm()
        .fillShippingAddressForm()
        .shouldShowShippingAsBillingText();
  });
});
