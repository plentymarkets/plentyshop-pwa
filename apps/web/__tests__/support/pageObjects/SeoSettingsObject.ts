import { PageObject } from './PageObject';

export class SeoSettingsObject extends PageObject {
  checkDrawerVisible() {
    this.settingsDrawer.should('be.visible');
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

  selectItemUrlHandlingSection() {
    this.siteSettingsItemUrlHandling.should('be.visible').click()
    return this
  }

  toggleItemUrlHandlingSection() {
    this.itemUrlHandlingSection.should('be.visible').click();
    return this;
  }

  checkLegacyButton() {
    this.legacyBtn.click()
        .should('have.class', 'bg-gray-100')
        .and('have.class', 'font-semibold');

    this.legacyBtn.find('.invisible').should('not.exist');
    this.modernBtn.should('not.have.class', 'bg-gray-100');

    return this;
  }

  checkModernButton() {
    this.modernBtn.click()
        .should('have.class', 'bg-gray-100')
        .and('have.class', 'font-semibold');;
    //
    this.modernBtn.find('.invisible').should('not.exist');
    this.legacyBtn.should('not.have.class', 'bg-gray-100');

    return this;
  }

  goBackSection() {
    this.backButton.should('be.visible').click();
    return this;
  }

  get legacyBtn() {
    return cy.getByTestId('button-item-url-handling-legacy');
  }

  get modernBtn() {
    return cy.getByTestId('button-item-url-handling-modern');
  }

  get closeButton() {
    return cy.getByTestId('view-close');
  }

  get settingsDrawer() {
    return cy.getByTestId('site-settings-drawer');
  }

  get itemUrlHandlingSection() {
    return cy.getByTestId('item-URL-handling-section');
  }

  get siteSettingsItemUrlHandling() {
    return cy.getByTestId('site-settings-category-item-URL-handling');
  }

  get backButton() {
    return cy.getByTestId('view-back');
  }
}
