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
  // The credit card test fails if "MOLLIE_TEST_MODE=true" is missing in the .env. Make sure it's set locally and in the GitHub Action runtime.
  it('[feature] Check mollie credit card payment and place a test order', () => {
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
