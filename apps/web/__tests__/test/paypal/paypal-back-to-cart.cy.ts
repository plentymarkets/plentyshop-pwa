import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { paths } from '../../../app/utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';

const checkout = new CheckoutPageObject();
const myAccount: MyAccountPageObject = new MyAccountPageObject();
const cart = new CartPageObject();

beforeEach(() => {
  cy.clearCookies().visitSmoke();
});

describe('Rendering: PayPal components', () => {
  it('[smoke] Render Cart page after selecting PayPal in the checkout + render PayPal buttons', () => {
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.intercept('/plentysystems/getSession').as('getSession');
    cy.intercept('/plentysystems/getPaymentProviders').as('getPaymentProviders');
    cy.intercept('/plentysystems/getAddressesData').as('getAddressesData');
    cy.intercept('/plentysystems/getShippingProvider').as('getShippingProvider');
    cy.intercept('/plentysystems/doHandlePayPalFundingSources').as('doHandlePayPalFundingSources');

    cy.visitAndHydrate(paths.authLogin);
    myAccount.successLogin();

    cy.wait('@doLogin');
    cy.wait('@getSession');
    cy.addToCart();
    cart.openCart();

    cy.wait('@doHandlePayPalFundingSources');

    cart.openCheckout();
    cy.wait(['@getPaymentProviders', '@getAddressesData', '@getShippingProvider']);

    checkout.checkPayPal();
    checkout.goBack();

    cy.url().should('include', '/cart');
    cart.cartItemPrice.should('be.visible');
    cart.payPalButton.should('be.visible');
  });
});
