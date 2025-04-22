import { paths } from '../../../utils/paths';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { PaymentStatusScreen } from '../../support/pageObjects/PaymentStatusScreen';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();
const myAccount = new MyAccountPageObject();
const pymentStatus = new PaymentStatusScreen();

beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie(
    'consent-cookie',
    '{"CookieBar.essentials.label":{"CookieBar.essentials.cookies.plentyId.name":true,"CookieBar.essentials.cookies.vsfLocale.name":true,"CookieBar.essentials.cookies.consentCookie.name":true,"CookieBar.essentials.cookies.cloudflareTurnstile.name":true},"CookieBar.externalMedia.label":{},"CookieBar.functional.label":{"CookieBar.functional.cookies.scriptDemo.name":true,"CookieBar.essentials.cookies.payPal.name":true},"CookieBar.marketing.label":{}}',
  );
  cy.visitAndHydrate(paths.authLogin);

  cy.intercept('/plentysystems/doLogin').as('doLogin');
  myAccount.successLogin();
  cy.wait('@doLogin');

  homePage.goToCategory();
  productListPage.addToCart();
  cart.openCart();
  checkout.goToCheckout().acceptTerms();
});

describe('Mollie payment methods', () => {
  it('[feature] Check mollie credit cardpayment and place a test order', () => {
    checkout.checkMollieCreditCard().placeOrderButtons.click();

    checkout.fillMollieCreditCardForm();
    cy.getByTestId('pay-creditcard-button').click();
    pymentStatus.selectPaid();
    cy.window().then((win) => {
      const currentUrl = win.location.href;
      cy.intercept('/plentysystems/getMolliePaymentAndUpdateStatus').as('getMolliePaymentStatus');
      win.location.href = currentUrl.replace('https://mevofvd5omld.c01-14.plentymarkets.com', 'http://localhost:3000');
      cy.wait('@getMolliePaymentStatus');
      checkout.displayFullyPaid();
    });
  });

  it('[feature] Check mollie PayPal and place a fully paid order', () => {
    checkout.checkMolliePayPal().placeOrderButtons.click();

    pymentStatus.selectPaid();
    cy.window().then((win) => {
      const currentUrl = win.location.href;
      cy.intercept('/plentysystems/getMolliePaymentAndUpdateStatus').as('getMolliePaymentStatus');
      win.location.href = currentUrl.replace('https://mevofvd5omld.c01-14.plentymarkets.com', 'http://localhost:3000');
      cy.wait('@getMolliePaymentStatus');
      checkout.displayFullyPaid();
    });
  });

  it('[feature] Check mollie PayPal and place a failed paid order', () => {
    checkout.checkMolliePayPal().placeOrderButtons.click();

    pymentStatus.selectFailed();
    cy.window().then((win) => {
      const currentUrl = win.location.href;
      cy.intercept('/plentysystems/getMolliePaymentAndUpdateStatus').as('getMolliePaymentStatus');
      win.location.href = currentUrl.replace('https://mevofvd5omld.c01-14.plentymarkets.com', 'http://localhost:3000');
      cy.wait('@getMolliePaymentStatus');
    });
    cy.url().should('include', '/checkout');
  });
});
