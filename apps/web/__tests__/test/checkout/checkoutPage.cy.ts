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
});

describe('Smoke: Checkout Page', () => {
  it('[smoke] full checkout flow and place order', () => {
    // dont replace with cy.addToCart(); this should check the complete checkout flow
    cy.visitAndHydrate(paths.home);
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
    cy.visitSmoke().addToCart();
    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .shouldShowShippingMethods()
      .fillShippingAddressForm({
        country: '7',
        zipCode: '1234',
      })
      .waitForUiToRender()
      .shouldNotShowShippingMethods();
  });

  it('should load shipping methods after second clientside navigation to checkout', () => {
    cy.visitSmoke().addToCart();
    checkout.goToCheckoutPath().shouldShowShippingMethods().goBack().goToCheckoutPath().shouldShowShippingMethods();
  });

  it('should load payment methods after second clientside navigation to checkout', () => {
    cy.visitSmoke().addToCart();
    checkout.goToCheckoutPath().shouldShowPaymentMethods().goBack().goToCheckoutPath().shouldShowPaymentMethods();
  });
});
