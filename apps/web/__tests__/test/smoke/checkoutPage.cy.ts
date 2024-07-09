import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Checkout Page', () => {
  it('[smoke] Display checkout and place order', () => {
    cy.visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.addToCart()

    cart.openCart();
    checkout
        .goToCheckout()
        .goToGuestCheckout()
        .fillContactInformationForm()
        .addBillingAddress()
        .fillBillingAddressForm()
        .acceptTerms()
        .placeOrderButton()
        .displaySuccessPage();
  });
});
