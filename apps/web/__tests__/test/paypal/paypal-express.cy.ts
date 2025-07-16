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
  cy.clearCookies();
  cy.addToCart();
});

describe('PayPal Express Flows', () => {
  it('[feature] Guest Flow', () => {
    cy.visitAndHydrate(paths.cart);
    cy.intercept('/plentysystems/getPayPalMerchantAndClientIds').as('getPayPalMerchantAndClientIds');

    cy.wait('@getPayPalMerchantAndClientIds');
    cy.paypalFlow(payPalEmail, payPalPassword)
    readonlyCheckout.waitUntilDataIsLoaded().acceptTerms().placeOrderButton().displaySuccessPage().displayFullyPaid();
  });

  it('[feature] User Flow', () => {
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.intercept('/plentysystems/doCreatePayPalOrder').as('doCreatePayPalOrder');
    cy.intercept('/plentysystems/getPayPalMerchantAndClientIds').as('getPayPalMerchantAndClientIds');

    cy.visitAndHydrate(paths.authLogin);
    cy.capturePopup();

    myAccount.successLogin();
    cy.wait('@doLogin');

    cartPage.openCart();
    cy.wait('@getPayPalMerchantAndClientIds');
    cy.paypalFlow(payPalEmail, payPalPassword);

    readonlyCheckout.waitUntilDataIsLoaded().acceptTerms().placeOrderButton().displaySuccessPage().displayFullyPaid();
  });
});
