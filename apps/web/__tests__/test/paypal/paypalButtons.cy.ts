import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { paths } from '../../../utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';

const checkout = new CheckoutPageObject();
const myAccount: MyAccountPageObject = new MyAccountPageObject();

beforeEach(() => {
  cy.clearCookies().visitSmoke();
});

describe('Feature: PayPal button rendering', () => {
  it('[smoke] Render PayPal button on checkout after refresh', () => {
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.intercept('/plentysystems/getPaymentProviders').as('getPaymentProviders');

    cy.visitAndHydrate(paths.authLogin);
    myAccount.successLogin();

    cy.wait('@doLogin').visitAndHydrate(paths.home);

    cy.addToCart();
    checkout.goToCheckoutPath().checkPayPal();

    cy.reload();
    cy.wait('@getPaymentProviders');

    checkout.payPalButton.should('exist');
  });
});
