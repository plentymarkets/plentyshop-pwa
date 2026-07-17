import { PageObject } from './PageObject';

export class FooterBlockObject extends PageObject {
  get footerSettingsDrawer() {
    return cy.getByTestId('footer-settings-drawer');
  }

  get colorSection() {
    return cy.getByTestId('color-column-section');
  }

  get backgroundColorInput() {
    return cy.getByTestId('footer-bg-color-select');
  }

  get lastBlockWrapper() {
    return cy.get('[data-testid*="block-wrapper"]').last();
  }

  assertVisible() {
    this.footer.scrollIntoView().should('be.visible');
    return this;
  }

  assertLinks() {
    this.footer.find('a').should('have.length.gte', 1);
    this.footer.find('a').first().should('have.attr', 'href').and('not.be.empty');
    return this;
  }

  assertNotMovableOrDeletable() {
    this.lastBlockWrapper.find('[data-testid="move-up-button"]').should('not.exist');
    this.lastBlockWrapper.find('[data-testid="move-down-button"]').should('not.exist');
    this.lastBlockWrapper.find('[data-testid="delete-block-button"]').should('not.exist');
    return this;
  }

  openSettingsDrawer() {
    cy.getByTestId('toc-section-footer-settings').click({ force: true });
    this.footerSettingsDrawer.should('be.visible');
    return this;
  }

  assertSettingsSections() {
    this.colorSection.should('exist');
    return this;
  }

  assertColorSectionInteractive() {
    this.colorSection.click();
    this.backgroundColorInput.should('be.visible');
    return this;
  }

  changeBackgroundColor(value: string) {
    this.backgroundColorInput.clear().type(value);
    return this;
  }

  assertBackgroundColorValue(value: string) {
    this.backgroundColorInput.should('have.value', value);
    return this;
  }

  assertNotEditableOnPage() {
    this.footer.scrollIntoView();
    this.lastBlockWrapper.find('[data-testid="edit-block-actions"]').should('not.exist');
    return this;
  }
}
