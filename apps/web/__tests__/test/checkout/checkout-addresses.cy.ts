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

describe('Checkout Addresses', () => {
  it('should display same as shipping text if a guest creates his shipping address with billing same as shipping checked', () => {
    homePage.goToCategory();
    productListPage.addToCart();

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm({
        country: '1',
        zipCode: '12345',
      })
      .shouldShowShippingAsBillingText();
  });

  it('should not display shipping and billing address selection if a guest user creates his address', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm({
        country: '1',
        zipCode: '12345',
      })
      .shouldNotShowShippingAddressSelection()
      .shouldNotShowBillingAddressSelection();
  });

  it('should be able to edit the billing address as a guest user if selected same as shipping', () => {
    homePage.goToCategory();
    productListPage.addToCart();

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm({
        country: '1',
        zipCode: '12345',
      })
      .shouldShowShippingAsBillingText()
      .editBillingAddress();
    checkout.firstNameInput.clear();
    checkout.firstNameInput.type('John Guest Edit');
    checkout.saveBilling.click({ force: true });
    cy.get('#billing-address').should('contain', 'John Guest Edit');
  });
});
