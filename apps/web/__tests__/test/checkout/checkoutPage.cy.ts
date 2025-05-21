import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.visitAndHydrate(paths.home);
});

describe('Smoke: Checkout Page', () => {
  it('[smoke] Display checkout and place order', () => {
    homePage.goToCategory();
    productListPage.addToCart();

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .checkInvoice()
      .acceptTerms()
      .placeOrderButton()
      .displaySuccessPage();
  });

  it('[smoke] Display "no shipping methods available" when shipping country is Denmark', () => {
    cy.request('POST', 'http://localhost:8181/plentysystems/doAddCartItem', {"productId":1072,"quantity":1});

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .shouldShowShippingMethods()
      .fillShippingAddressForm({
        country: '7',
        zipCode: '1234',
      })
      .shouldNotShowShippingMethods();
  });
});
