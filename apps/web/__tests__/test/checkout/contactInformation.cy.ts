import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';

const checkout = new CheckoutPageObject();

beforeEach(() => {
  cy.clearCookies().visitSmoke();
});

describe.skip('Contact Information', () => {
  it('should scroll to contact information if email is invalid and buy button is clicked', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().contactInformationForm.type('invalid-email');

    checkout.acceptTerms();
    checkout.placeOrderButtons.click();
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should scroll to contact information if email is invalid and shipping address save is clicked', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().contactInformationForm.type('invalid-email');
    checkout.fillAddressForm('shipping');
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should scroll to contact information if email is invalid and billing address save is clicked', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().contactInformationForm.type('invalid-email');
    checkout.fillAddressForm('billing');
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should validate email input', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().contactInformationForm.type('invalid-email').blur();
    cy.get('#customerEmailError').should('exist');
  });

  it('should validate email input with minus "-"', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().contactInformationForm.type('valid-email@plentyone.com').blur();
    cy.get('#customerEmailError').should('not.exist');
  });

  it('should validate email input with dot "."', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().contactInformationForm.type('valid.email@plentyone.com').blur();
    cy.get('#customerEmailError').should('not.exist');
  });

  it('should be able to change the email after address is changed', () => {
    cy.addToCart();

    checkout.goToCheckoutPath().fillContactInformationForm().fillShippingAddressForm().fillContactInformationForm();
  });
});
