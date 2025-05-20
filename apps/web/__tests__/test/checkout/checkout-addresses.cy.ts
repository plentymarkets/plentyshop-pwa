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

  homePage.goToCategory();
  productListPage.addToCart();
});

describe('Checkout Addresses', () => {
  it('should display same as shipping text if a guest creates his shipping address with billing same as shipping checked', () => {
    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .shouldShowShippingAsBillingText();
  });

  it('should not display shipping and billing address selection if a guest user creates his address', () => {
    cart.openCart();

    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .shouldNotShowShippingAddressSelection()
      .shouldNotShowBillingAddressSelection();
  });

  it('should be able to edit the billing address as a guest user if selected same as shipping', () => {
    cart.openCart();

    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .shouldShowShippingAsBillingText()
      .editBillingAddress();
    checkout.firstNameInput.clear();
    checkout.firstNameInput.type('John Guest Edit');
    checkout.saveBilling.click({ force: true });
    cy.get('#billing-address').should('contain', 'John Guest Edit');
  });
});
