import { paths } from '../../../utils/paths';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie(
    'consent-cookie',
    '{"CookieBar.essentials.label":{"CookieBar.essentials.cookies.plentyId.name":true,"CookieBar.essentials.cookies.vsfLocale.name":true,"CookieBar.essentials.cookies.consentCookie.name":true,"CookieBar.essentials.cookies.cloudflareTurnstile.name":true},"CookieBar.externalMedia.label":{},"CookieBar.functional.label":{"CookieBar.functional.cookies.scriptDemo.name":true,"CookieBar.essentials.cookies.payPal.name":true},"CookieBar.marketing.label":{}}',
  );
  cy.visitAndHydrate(paths.home);
});

describe('Mollie payment methods', () => {
  it('[smoke] Check mollie credit cardpayment and place a test order', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .checkMollieCreditCard()
      .fillShippingAddressForm()
      .acceptTerms()
      .placeOrderButtons.click();

    cy.wait(4000);

    checkout.mollieCreditCardModal.should('exist');
  });

  it('[smoke] Check mollie credit cardpayment and place a test order', () => {
    cy.setCookie('vsf-locale', 'de');
    cy.visitAndHydrate(paths.home + 'de');
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .checkMollieEPS()
      .fillShippingAddressForm()
      .acceptTerms()
      .placeOrderButton();
  });
});
