import { PageObject } from './PageObject';

export class SiteSettingsObject extends PageObject {
  get closeButton() {
    return cy.getByTestId('design-view-close');
  }

  get settingsDrawer() {
    return cy.getByTestId('site-settings-drawer');
  }

  get fontSection() {
    return cy.getByTestId('font-section');
  }

  get colorSection() {
    return cy.getByTestId('color-section');
  }

  get blockSpacingSection() {
    return cy.getByTestId('block-spacing-section');
  }

  get fontInput() {
    return cy.getByTestId('font-select');
  }

  get body() {
    return cy.get('body');
  }

  get navbar() {
    return cy.getByTestId('navbar-top');
  }

  get block() {
    return cy.getByTestId('block-wrapper');
  }

  get saveButton() {
    return cy.getByTestId('edit-save-button');
  }

  get primaryColorInput() {
    return cy.getByTestId('primary-color-select');
  }

  get secondaryColorInput() {
    return cy.getByTestId('secondary-color-select');
  }

  get blockSpacingButton() {
    return cy.getByTestId(`block-spacing-btn`);
  }

  closeDrawer() {
    this.closeButton.should('be.visible').click();
    return this;
  }

  checkDrawerVisible() {
    this.settingsDrawer.should('be.visible');
    return this;
  }

  checkDrawerNotVisible() {
    this.settingsDrawer.should('not.exist');
    return this;
  }

  checkSaveButtonDisabled() {
    this.saveButton.should('be.disabled');
    return this;
  }

  checkSaveButtonEnabled() {
    this.saveButton.should('be.enabled');
    return this;
  }

  toggleFonts() {
    this.fontSection.should('be.visible').click();
    return this;
  }

  toggleColor() {
    this.colorSection.should('be.visible').click();
    return this;
  }

  toggleBlockSpacing() {
    this.blockSpacingSection.should('be.visible').click();
    return this;
  }

  changeFont(fontColor: string) {
    this.fontInput.click().type(fontColor);
    cy.get('.multiselect__element').contains(fontColor).click();
    return this;
  }

  changeColor(primaryColor: string, secondaryColor: string) {
    this.primaryColorInput.should('be.visible').clear().type(primaryColor);
    this.secondaryColorInput.should('be.visible').clear().type(secondaryColor);
    return this;
  }

  changeBlockSpacing(blockSpacing: string) {
    this.blockSpacingButton.should('be.visible').contains(blockSpacing).click();
    return this;
  }

  checkFontPreview(fontColor: string) {
    this.body.should('have.attr', { 'font-family': fontColor });
    return this;
  }

  checkColorPreview(fontColor: string) {
    this.body.should('have.attr', { 'background-color': fontColor });
    return this;
  }

  checkBlockSpacingPreview(blockSpacingMargin: string) {
    this.block.first().should('have.attr', { 'margin-bottom': `${blockSpacingMargin}px` });
    return this;
  }
}
