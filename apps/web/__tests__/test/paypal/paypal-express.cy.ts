import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { ReadonlyCheckoutPageObject } from '../../support/pageObjects/ReadonlyCheckoutPageObject';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { paths } from '../../../utils/paths';

const myAccount: MyAccountPageObject = new MyAccountPageObject();
const readonlyCheckout = new ReadonlyCheckoutPageObject();
const cartPage = new CartPageObject();

const payPalEmail = Cypress.env('E2E_TEST_PAYPAL_EMAIL') ?? '';
const payPalPassword = Cypress.env('E2E_TEST_PAYPAL_PASSWORD') ?? '';

beforeEach(() => {
  cy.resetPopupStub();
  cy.clearCookies();
  cy.addToCart();
});

describe('PayPal Express Flows', () => {
  it('[feature] Guest Flow', () => {
    cy.intercept('/plentysystems/getPayPalMerchantAndClientIds').as('getPayPalMerchantAndClientIds');
    cy.intercept('/plentysystems/getSession').as('getSession');
    cy.visitAndHydrate(paths.cart);
    cy.wait(['@getSession', '@getPayPalMerchantAndClientIds']);
    cy.paypalFlow(payPalEmail, payPalPassword);
    readonlyCheckout.waitUntilDataIsLoaded().acceptTerms().placeOrderButton().displaySuccessPage().displayFullyPaid();
  });

  it('[feature] User Flow', () => {
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.intercept('/plentysystems/getPayPalMerchantAndClientIds').as('getPayPalMerchantAndClientIds');
    cy.intercept('/plentysystems/getSession').as('getSession');

    cy.visitAndHydrate(paths.authLogin);

    myAccount.successLogin();
    cy.wait('@doLogin');
    cy.wait('@getSession');

    cartPage.openCart();
    cy.wait(['@getSession', '@getPayPalMerchantAndClientIds']);
    cy.paypalFlow(payPalEmail, payPalPassword);

    readonlyCheckout.waitUntilDataIsLoaded().acceptTerms().placeOrderButton().displaySuccessPage().displayFullyPaid();
  });
});
