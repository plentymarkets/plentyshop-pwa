import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: PayPal credit card order', () => {
  it('[smoke] Check if status on order gets updated when paying with paypal credit card', () => {
    Cypress.Cookies.debug(true);
    cy.setCookie("vsf-locale", "en");
    cy.setCookie("consent-cookie", "%5B%7B%22Essentials%22%3A%5B%7B%22Session%22%3Atrue%7D%2C%7B%22Consent%22%3Atrue%7D%2C%7B%22Session2%22%3Atrue%7D%5D%7D%2C%7B%22External%20Media%22%3A%5B%7B%22Session%22%3Atrue%7D%2C%7B%22Consent%22%3Atrue%7D%2C%7B%22Session2%22%3Atrue%7D%5D%7D%2C%7B%22Functional%22%3A%5B%7B%22Session%22%3Atrue%7D%2C%7B%22Consent%22%3Atrue%7D%2C%7B%22Session2%22%3Atrue%7D%5D%7D%2C%7B%22Marketing%22%3A%5B%7B%22Session%22%3Atrue%7D%2C%7B%22Consent%22%3Atrue%7D%2C%7B%22Session2%22%3Atrue%7D%5D%7D%5D");

    cy.visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.addToCart()

    cart.openCart();
    checkout
        .goToCheckout()
        .fillContactInformationForm()
        .addBillingAddress()
        .fillBillingAddressForm()
        .acceptTerms()
        .checkCreditCard()
        .placeOrderButton()
        .fillCreditCardForm()
        .payCreditCard()
        .displaySuccessPage()
        .displayFullPayed();
  });
});
