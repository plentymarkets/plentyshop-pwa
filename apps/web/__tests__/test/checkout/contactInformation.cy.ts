import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.visitAndHydrate('/smoke-e2e');
});

describe('Contact Information', () => {
  it('should scroll to contact information if email is invalid and buy button is clicked', () => {
    cy.addToCart();
    checkout.goToCheckoutPath()

    checkout.contactInformationForm.type('invalid-email');

    checkout.acceptTerms();
    checkout.placeOrderButtons.click();
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should scroll to contact information if email is invalid and shipping address save is clicked', () => {
    cy.addToCart();
    checkout.goToCheckoutPath()

    checkout.contactInformationForm.type('invalid-email');
    checkout.fillAddressForm('shipping');
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should scroll to contact information if email is invalid and billing address save is clicked', () => {
    cy.addToCart();
    checkout.goToCheckoutPath()

    checkout.contactInformationForm.type('invalid-email');
    checkout.fillAddressForm('billing');
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should validate email input', () => {
    cy.addToCart();
    checkout.goToCheckoutPath()
    checkout.contactInformationForm.type('invalid-email').blur();
    cy.get('#customerEmailError').should('exist');
  });

  it('should validate email input with minus "-"', () => {
    cy.addToCart();
    checkout.goToCheckoutPath()

    checkout.contactInformationForm.type('valid-email@plentyone.com').blur();
    cy.get('#customerEmailError').should('not.exist');
  });

  it('should validate email input with dot "."', () => {
    cy.addToCart();
    checkout.goToCheckoutPath()

    checkout.contactInformationForm.type('valid.email@plentyone.com').blur();
    cy.get('#customerEmailError').should('not.exist');
  });

  it('should be able to change the email after address is changed', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .fillContactInformationForm();
  });
});
