import { paths } from '../../../utils/paths';
import { PageObject } from './PageObject';

export class MyAccountPageObject extends PageObject {
  get accountLayout() {
    return cy.getByTestId('account-layout');
  }

  successLogin() {
    cy.getFixture('account').then((fixture) => {
      cy.get(`[type="email"]`).type(fixture.email, { delay: 0 });
      cy.get(`[type="password"]`).type(fixture.password, { delay: 0 });
    });

    cy.getByTestId('login-submit').click();

    return this;
  }

  get accountDataListItem() {
    return cy.get(`a[href="${paths.account}"]`);
  }

  get accountOrdersListItem() {
    return cy.get(`a[href="${paths.accountMyOrders}"]`);
  }

  get accountReturnsListItem() {
    return cy.get(`a[href="${paths.accountReturns}"]`);
  }

  clickTopBarMyAccountLink() {
    cy.getByTestId('account-dropdown-button').should('exist').click();

    this.accountDataListItem.should('exist').contains('My Account').click();

    cy.url().should('contain', paths.account);
  }

  clickTopBarMyOrdersLink() {
    cy.getByTestId('account-dropdown-button').should('exist').click();

    this.accountOrdersListItem.should('exist').contains('My Orders').click();

    cy.url().should('contain', paths.accountMyOrders);
  }

  clickTopBarReturnsLink() {
    cy.getByTestId('account-dropdown-button').should('exist').click();

    this.accountReturnsListItem.should('exist').contains('Returns').click();

    cy.url().should('contain', paths.accountReturns);
  }

  clickTopBarLogoutButton() {
    cy.intercept('/plentysystems/doLogoutUser').as('doLogoutUser');
    cy.getByTestId('account-dropdown-button').should('exist').click();
    cy.getByTestId('account-dropdown-logout-item').should('exist').click();

    cy.wait('@doLogoutUser').url().should('contain', paths.home);
    cy.getByTestId('account-dropdown-button').should('not.exist');
  }

  checkAllSectionsMenu() {
    this.accountLayout.getByTestId('account-layout-heading').should('be.visible');
    this.accountLayout.getByTestId('account-page-sidebar').should('be.visible');
    this.accountLayout.contains('Account Settings').should('exist');
    this.accountLayout.contains('Personal data').should('exist');
    this.accountLayout.contains('Billing addresses').should('exist');
    this.accountLayout.contains('Shipping addresses').should('exist');
    this.accountLayout.contains('Orders & Returns').should('exist');
    this.accountLayout.contains('My Orders').should('exist');
    this.accountLayout.contains('Returns').should('exist');
    this.accountLayout.contains('Wishlist').should('exist');
    this.accountLayout.contains('My wishlist').should('exist');
    this.accountLayout.contains('Logout').should('exist');

    return this;
  }

  checkPersonalDataSection() {
    cy.get('a').contains('Personal data').click();
    cy.visitAndHydrate(paths.accountPersonalData);
    cy.url().should('contain', paths.accountPersonalData);
    this.accountLayout.getByTestId('account-name').should('be.visible');
    this.accountLayout.getByTestId('account-email').should('be.visible');
    this.accountLayout.getByTestId('account-password').should('be.visible');

    return this;
  }

  checkBillingAddressesSection() {
    cy.intercept('/plentysystems/getAddresses').as('getAddresses');
    cy.get('a').contains('Billing addresses').click();
    cy.url().should('contain', paths.accountBillingDetails);
    cy.wait('@getAddresses');
    this.accountLayout.getByTestId('account-billing-addresses-1').should('be.visible');

    return this;
  }

  checkShippingAddressesSection() {
    cy.intercept('/plentysystems/getAddresses').as('getAddresses');
    cy.get('a').contains('Shipping addresses').click();
    cy.url().should('contain', paths.accountShippingDetails);
    cy.wait('@getAddresses');
    this.accountLayout.getByTestId('account-billing-addresses-2').should('be.visible');

    return this;
  }

  checkMyOrdersSection() {
    cy.get('a').contains('My Orders').click();
    cy.visitAndHydrate(paths.accountMyOrders);
    cy.url().should('contain', paths.accountMyOrders);
    this.accountLayout.getByTestId('account-orders-heading').should('be.visible');
    this.accountLayout.getByTestId('account-orders-content').should('be.visible');

    return this;
  }

  checkReturnsSection() {
    cy.get('a').contains('Returns').click();
    cy.visitAndHydrate(paths.accountReturns);
    cy.url().should('contain', paths.accountReturns);
    this.accountLayout.getByTestId('account-returns-heading').should('be.visible');
    this.accountLayout.getByTestId('account-returns-content').should('be.visible');

    return this;
  }

  checkWishlistSection() {
    cy.get('a').contains('My wishlist').click();
    cy.visitAndHydrate(paths.accountMyWishlist);
    cy.url().should('contain', paths.accountMyWishlist);
    this.accountLayout.getByTestId('wishlist-page-content').should('be.visible');

    return this;
  }

  checkLogoutSection() {
    cy.intercept('/plentysystems/doLogoutUser').as('doLogoutUser');

    this.accountLayout.getByTestId('account-logout-button').should('exist').click();

    cy.wait('@doLogoutUser').visitAndHydrate(paths.home);
    cy.url().should('contain', paths.home);
    cy.getByTestId('account-dropdown-button').should('not.exist');

    return this;
  }
}
