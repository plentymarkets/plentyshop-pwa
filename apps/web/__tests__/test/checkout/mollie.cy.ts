import { paths } from '../../../app/utils/paths';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { PaymentStatusScreen } from '../../support/pageObjects/PaymentStatusScreen';

const checkout = new CheckoutPageObject();
const myAccount = new MyAccountPageObject();
const paymentStatus = new PaymentStatusScreen();

beforeEach(() => {
  cy.clearCookies();
  cy.addToCart();
  cy.visitAndHydrate(paths.authLogin);

  cy.intercept('/plentysystems/doLogin').as('doLogin');
  myAccount.successLogin();
  cy.wait('@doLogin');
  checkout.goToCheckoutPath().acceptTerms();
});

describe('Mollie payment methods', () => {
  // The credit card test fails if "MOLLIE_TEST_MODE=true" is missing in the .env. Make sure it's set locally and in the GitHub Action runtime.
  it('[feature] Check mollie credit card payment and place a test order', () => {
    cy.intercept('/plentysystems/doAdditionalInformation').as('doAdditionalInformation');
    cy.intercept('/plentysystems/doPreparePayment').as('doPreparePayment');
    cy.intercept('/plentysystems/doCreateMolliePaymentFromBasket').as('doCreateMolliePaymentFromBasket');
    cy.intercept('/plentysystems/doCreatePlentyPaymentFromMolliePayment').as('doCreatePlentyPaymentFromMolliePayment');
    cy.intercept('/plentysystems/doPlaceOrder').as('doPlaceOrder');
    cy.intercept('/plentysystems/getOrder').as('getOrder');

    checkout.checkMollieCreditCard().placeOrderButtons.click();
    cy.wait('@doAdditionalInformation');

    checkout.fillMollieCreditCardForm();
    cy.getByTestId('pay-creditcard-button').click();
    cy.wait('@doPreparePayment');

    cy.wait('@doCreateMolliePaymentFromBasket');
    cy.wait('@doCreatePlentyPaymentFromMolliePayment');

    paymentStatus.selectPaid();
    cy.window().then((win) => {
      const currentUrl = win.location.href;
      cy.intercept('/plentysystems/getMolliePaymentAndUpdateStatus').as('getMolliePaymentStatus');
      win.location.href = currentUrl.replace('https://mevofvd5omld.c01-14.plentymarkets.com', 'http://localhost:3000');
      cy.wait('@getMolliePaymentStatus');
      cy.wait('@doPlaceOrder');
      cy.wait('@getOrder');
      checkout.displayFullyPaid();
    });
  });

  it('[feature] Check mollie PayPal and place a fully paid order', () => {
    cy.intercept('/plentysystems/doAdditionalInformation').as('doAdditionalInformation');
    cy.intercept('/plentysystems/doCreateMolliePaymentFromBasket').as('doCreateMolliePaymentFromBasket');
    cy.intercept('/plentysystems/doCreatePlentyPaymentFromMolliePayment').as('doCreatePlentyPaymentFromMolliePayment');
    cy.intercept('/plentysystems/doPreparePayment').as('doPreparePayment');
    cy.intercept('/plentysystems/doPlaceOrder').as('doPlaceOrder');
    cy.intercept('/plentysystems/getOrder').as('getOrder');

    checkout.checkMolliePayPal().placeOrderButtons.click();
    cy.wait('@doAdditionalInformation');
    cy.wait('@doPreparePayment');
    cy.wait('@doCreateMolliePaymentFromBasket');
    cy.wait('@doCreatePlentyPaymentFromMolliePayment');

    paymentStatus.selectPaid();
    cy.window().then((win) => {
      const currentUrl = win.location.href;
      cy.intercept('/plentysystems/getMolliePaymentAndUpdateStatus').as('getMolliePaymentStatus');
      win.location.href = currentUrl.replace('https://mevofvd5omld.c01-14.plentymarkets.com', 'http://localhost:3000');
      cy.wait('@getMolliePaymentStatus');
      cy.wait('@doPlaceOrder');
      cy.wait('@getOrder');
      checkout.displayFullyPaid();
    });
  });

  it('[feature] Check mollie PayPal and place a failed paid order', () => {
    cy.intercept('/plentysystems/doAdditionalInformation').as('doAdditionalInformation');
    cy.intercept('/plentysystems/doPreparePayment').as('doPreparePayment');
    cy.intercept('/plentysystems/doCreateMolliePaymentFromBasket').as('doCreateMolliePaymentFromBasket');
    cy.intercept('/plentysystems/doCreatePlentyPaymentFromMolliePayment').as('doCreatePlentyPaymentFromMolliePayment');

    checkout.checkMolliePayPal().placeOrderButtons.click();
    cy.wait('@doAdditionalInformation');
    cy.wait('@doPreparePayment');
    cy.wait('@doCreateMolliePaymentFromBasket');
    cy.wait('@doCreatePlentyPaymentFromMolliePayment');

    paymentStatus.selectFailed();
    cy.window().then((win) => {
      const currentUrl = win.location.href;
      cy.intercept('/plentysystems/getMolliePaymentAndUpdateStatus').as('getMolliePaymentStatus');
      win.location.href = currentUrl.replace('https://mevofvd5omld.c01-14.plentymarkets.com', 'http://localhost:3000');
      cy.wait('@getMolliePaymentStatus');
    });
    cy.url().should('include', '/checkout');
  });
});
