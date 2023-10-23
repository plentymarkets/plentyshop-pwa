import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Cart Page', () => {
  it('[smoke] Check if status on order gets updated when paying with paypal', () => {
    cy.visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.addToCart()

    cart.openCart();
    checkout
        .goToCheckout()
        .fillContactInformationForm()
        .addBillingAddress()
        .fillBillingAddressForm()
        .checkCreditCard()
        .acceptTerms()
        .placeOrderButton()
        .displaySuccessPage()
        .displayFullPayed();
  });
});
