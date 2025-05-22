import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { paths } from '../../../utils/paths';

const checkout = new CheckoutPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.visitAndHydrate(paths.home);
});

describe('Checkout Addresses', () => {
  it('should display same as shipping text if a guest creates his shipping address with billing same as shipping checked', () => {
    cy.addToCart();

    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .fillShippingAddressForm({
        country: '1',
        zipCode: '12345',
      })
      .shouldShowShippingAsBillingText();
  });

  it('should not display shipping and billing address selection if a guest user creates his address', () => {
    cy.addToCart();

    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .fillShippingAddressForm({
        country: '1',
        zipCode: '12345',
      })
      .shouldNotShowShippingAddressSelection()
      .shouldNotShowBillingAddressSelection();
  });

  it('should be able to edit the billing address as a guest user if selected same as shipping', () => {
    cy.addToCart();
    checkout
      .goToCheckoutPath()
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
