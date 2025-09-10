import { PageObject } from './PageObject';

export class GeneralSettingsObject extends PageObject {
  checkDrawerVisible() {
    this.settingsDrawer.should('be.visible');
    return this;
  }

  toggleCustomerManagement() {
    cy.getByTestId('site-settings-sub-category-customer-management').click();
    return this;
  }

  toggleSection(sectionName) {
    this.customerClassSection(sectionName).should('be.visible').click({ force: true });
    return this;
  }

  checkDropdownExist(dropdownId) {
    this.drodownSelect(dropdownId).should('exist');
    return this;
  }

  drodownSelect(dropdownId) {
    return cy.getByTestId(dropdownId);
  }

  goBackSection() {
    this.backButton.should('be.visible').click();
    return this;
  }

  closeDrawer() {
    this.closeButton.should('be.visible').click();
    return this;
  }
  checkDrawerNotVisible() {
    this.settingsDrawer.should('not.exist');
    return this;
  }

  customerClassSection(name) {
    if (name === 'b2c') {
      return cy.getByTestId('default-B2C-and-guest-customer-class-section');
    }
    return cy.getByTestId('default-B2B-customer-class-section');
  }

  get backButton() {
    return cy.getByTestId('view-back');
  }

  get closeButton() {
    return cy.getByTestId('view-close');
  }

  get settingsDrawer() {
    return cy.getByTestId('site-settings-drawer');
  }
}
