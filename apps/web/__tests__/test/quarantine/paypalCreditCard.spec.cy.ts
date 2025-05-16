import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';

const myAccount = new MyAccountPageObject();
const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: PayPal credit card order', () => {
  beforeEach(() => {});

  it('[smoke] Check if status on order gets updated when paying with paypal credit card', () => {
    cy.visitAndHydrate(paths.authLogin);

    cy.intercept('/plentysystems/doLogin').as('doLogin');
    myAccount.successLogin();
    cy.wait('@doLogin');

    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().acceptTerms().checkCreditCard().placeCreditCartOrder().fillCreditCardForm().payCreditCard();
  });
});
