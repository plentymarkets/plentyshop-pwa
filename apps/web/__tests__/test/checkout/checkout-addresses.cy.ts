import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { paths } from '../../../app/utils/paths';

const checkout = new CheckoutPageObject();
const myAccount = new MyAccountPageObject();

beforeEach(() => {
  cy.clearCookies().visitSmoke();
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
      .fillShippingAddressForm({
        country: '1',
        zipCode: '12345',
      })
      .shouldShowShippingAsBillingText()
      .editBillingAddress();
    cy.wait(1000);
    checkout.firstNameInput.clear();
    checkout.firstNameInput.type('John Guest Edit');
    checkout.saveBilling.click({ force: true });
    cy.get('#billing-address').should('contain', 'John Guest Edit');
  });

  it('should toggle billing address section with sameAsBilling checkbox', () => {
    cy.addToCart();

    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .checkSameAsBilling()
      .billingAddressSection.should('not.exist');
    checkout.uncheckSameAsBilling().billingAddressSection.should('exist');
    checkout.billingAddressForm.should('exist');
  });

  it('should not show any forms as logged in user with existing addresses', () => {
    cy.addToCart();
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.intercept('/plentysystems/getAddresses').as('getAddresses');
    cy.visitAndHydrate(paths.authLogin);
    myAccount.successLogin();
    cy.wait('@doLogin');
    checkout.goToCheckoutPath();

    cy.wait('@getAddresses');
    cy.wait('@getAddresses');

    checkout.billingAddressForm.should('not.exist');
    checkout.shippingAddressForm.should('not.exist');
  });
});
