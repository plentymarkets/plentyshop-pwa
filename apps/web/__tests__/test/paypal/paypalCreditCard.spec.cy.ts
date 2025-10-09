import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { paths } from '../../../app/utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';

const myAccount = new MyAccountPageObject();
const checkout = new CheckoutPageObject();

describe('Smoke: PayPal credit card order', () => {
  it('[smoke] Check if status on order gets updated when paying with paypal credit card', () => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.authLogin);

    cy.intercept('/plentysystems/doLogin').as('doLogin');
    myAccount.successLogin();
    cy.wait('@doLogin');
    cy.addToCart();
    checkout
      .goToCheckoutPath()
      .acceptTerms()
      .checkCreditCard()
      .placeCreditCartOrder()
      .fillCreditCardForm()
      .payCreditCard();
  });
});
