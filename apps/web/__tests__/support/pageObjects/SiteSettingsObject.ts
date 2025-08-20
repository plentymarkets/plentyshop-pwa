import { PageObject } from './PageObject';

export class SiteSettingsObject extends PageObject {
  get backButton() {
    return cy.getByTestId('view-back');
  }

  get closeButton() {
    return cy.getByTestId('view-close');
  }

  get settingsDrawer() {
    return cy.getByTestId('site-settings-drawer');
  }

  get brandingAndDesign() {
    return cy.getByTestId('site-settings-sub-category-branding-and-design');
  }

  get fontSection() {
    return cy.getByTestId('fonts-section');
  }

  get colorSection() {
    return cy.getByTestId('colors-section');
  }

  get blockSpacingSection() {
    return cy.getByTestId('block-spacing-section');
  }

  get itemBundlesSection() {
    return cy.getByTestId('item-bundles-section');
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

  get itemBundlesSelect() {
    return cy.getByTestId('editor-bundleSettings-select');
  }

  back() {
    this.backButton.should('be.visible').click();
    return this;
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

  toggleBrandingAndDesign() {
    this.brandingAndDesign.should('be.visible').click();
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

  toggleItemBundlesSection() {
    this.itemBundlesSection.should('be.visible').click();
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

  checkOptionsExist() {
    this.itemBundlesSelect.select("Only list the components of the item bundle and replace the item bundle with the basic items in the order process").should('have.value', '0');
    this.itemBundlesSelect.select("Only show item bundle without individual components and do not split the item bundle in the order process").should('have.value', '1');
    this.itemBundlesSelect.select("List both the item bundle and its individual components").should('have.value', '2');
    return this;
  }
}
