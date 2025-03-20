import { paths } from '../../../utils/paths';
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
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie(
    'consent-cookie',
    '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}',
  );
  cy.visitAndHydrate(paths.home);
});

describe('Contact Information', () => {
  it('should scroll to contact information if email is invalid and buy button is clicked', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().goToGuestCheckout();

    checkout.contactInformationForm.type('invalid-email');

    checkout.acceptTerms();
    checkout.placeOrderButtons.click();
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should scroll to contact information if email is invalid and shipping address save is clicked', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().goToGuestCheckout();

    checkout.contactInformationForm.type('invalid-email');
    checkout.fillAddressForm('shipping');
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should scroll to contact information if email is invalid and billing address save is clicked', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().goToGuestCheckout();

    checkout.contactInformationForm.type('invalid-email');
    checkout.fillAddressForm('billing');
    checkout.contactInformationForm.isScrolledTo();
  });

  it('should validate email input', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().goToGuestCheckout();

    checkout.contactInformationForm.type('invalid-email').blur();
    cy.get('#customerEmailError').should('exist');
  });

  it('should validate email input with minus "-"', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().goToGuestCheckout();

    checkout.contactInformationForm.type('valid-email@plentyone.com').blur();
    cy.get('#customerEmailError').should('not.exist');
  });

  it('should validate email input with dot "."', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();

    checkout.goToCheckout().goToGuestCheckout();

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
