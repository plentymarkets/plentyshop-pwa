import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

beforeEach(() => {
  cy.clearCookies().visitSmoke();
});

describe('Smoke: Checkout Page', () => {
  it('[smoke] full checkout flow and place order', () => {
    // dont replace with cy.addToCart(); this should check the complete checkout flow
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
    cy.addToCart();
    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .shouldShowShippingMethods()
      .fillShippingAddressForm({
        country: '7',
        zipCode: '1234',
      })
      .shouldNotShowShippingMethods();
  });
});
