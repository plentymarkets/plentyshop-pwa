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

  get designSubcategory() {
    return cy.getByTestId('site-settings-sub-category-design');
  }

  get customScriptsCategory() {
    return cy.getByTestId('custom-scripts-sub-category');
  }

  get customScriptsForm() {
    return cy.getByTestId('custom-scripts-form');
  }

  get positionSelect() {
    return cy.getByTestId('script-placement-select');
  }

  get customJsAccordion() {
    return cy.getByTestId('site-settings-sub-category-custom-js');
  }

  get addSnippetButtonEmpty() {
    return cy.getByTestId('add-code-snippet-empty');
  }

  get assetsDrawer() {
    return cy.getByTestId('assets-drawer');
  }

  get snippetOverview() {
    return cy.getByTestId('code-snippet-overview');
  }

  get addSnippetButton() {
    return cy.getByTestId('add-code-snippet');
  }

  get codeEditor() {
    return cy.getByTestId('code-editor');
  }

  get snippetSwitch() {
    return cy.getByTestId('activate-snippet');
  }

  get customSettingsSection() {
    return cy.getByTestId('custom-js-settings-section');
  }

  get fontSection() {
    return cy.getByTestId('fonts-section');
  }

  get colorSection() {
    return cy.getByTestId('colours-section');
  }

  get blockSpacingSection() {
    return cy.getByTestId('spacing-section');
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

  get blockHorizontalSpacingButton() {
    return cy.getByTestId(`block-horizontal-spacing-btn`);
  }

  get blockVerticalSpacingButton() {
    return cy.getByTestId(`block-vertical-spacing-btn`);
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

  openDesignSubcategory() {
    this.designSubcategory.should('be.visible').click();
    return this;
  }

  checkCustomCodeHeader() {
    this.settingsDrawer.should('be.visible');
    this.settingsDrawer.find('div.text-xl.font-bold').should('contain.text', 'Custom Code');
    return this;
  }

  changeCustomScript() {
    this.customJsAccordion.should('be.visible').click({ force: true }); // force needed due to tooltip overlap
    this.addSnippetButtonEmpty.should('be.visible').scrollIntoView().click({ force: true });
    cy.wait(500);
    this.positionSelect.should('be.visible').should('have.value', 'head_end');
    cy.wait(500);
    this.codeEditor.should('be.visible').click().type('// Custom JavaScript Code');
    return this;
  }

  toggleCustomScriptsSettings() {
    this.customScriptsCategory.should('be.visible').click();
    return this;
  }

  checkScriptPlacementFooter() {
    this.positionSelect.should('be.visible').should('have.value', 'head_end');
    this.positionSelect.select('body_end');
    this.positionSelect.should('have.value', 'body_end');
    this.customSettingsSection.should('be.visible').click();
    this.snippetOverview.should('be.visible');
    this.snippetSwitch.should('be.visible').click();
    cy.get('body')
      .children()
      .last()
      .should('match', 'script')
      .and('have.attr', 'data-hid')
      .and('match', /^custom-js-.*-footer$/);
    return this;
  }

  checkScriptPlacementHeader() {
    this.positionSelect.should('be.visible').should('have.value', 'body_end');
    this.positionSelect.select('head_end');
    this.positionSelect.should('have.value', 'head_end');
    this.customSettingsSection.should('be.visible').click();
    this.snippetOverview.should('be.visible');
    cy.get('head')
      .children('script')
      .last()
      .should('have.attr', 'data-hid')
      .and('match', /^custom-js-/);
    return this;
  }

  toggleFonts() {
    this.fontSection.should('be.visible').click({ force: true }); // force needed due to tooltip overlap
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
    this.fontInput.click({ force: true }).type(fontColor, { force: true }); // force needed due to tooltip overlap
    cy.get('.multiselect__element').contains(fontColor).click({ force: true }); // force needed due to tooltip overlap
    return this;
  }

  changeColor(primaryColor: string, secondaryColor: string) {
    this.primaryColorInput.should('be.visible').clear().type(primaryColor);
    this.secondaryColorInput.should('be.visible').clear().type(secondaryColor);
    return this;
  }

  changeBlockHorizontalSpacing(value: string) {
    this.blockHorizontalSpacingButton.should('be.visible').contains(value).click();
    return this;
  }

  changeBlockVerticalSpacing(value: string) {
    this.blockVerticalSpacingButton.should('be.visible').contains(value).click();
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

  checkBlockHorizontalSpacingPreview(value: string) {
    this.block.eq(1).should('have.class', value);
    return this;
  }

  checkBlockVerticalSpacingPreview(value: string) {
    this.block.first().should('have.class', `mb-${value}`);
    return this;
  }

  checkOptionsExist() {
    const expectedTextsAndValues = [
      {
        text: 'Only list the components of the item bundle and replace the item bundle with the basic items in the order process',
        value: '0',
      },
      {
        text: 'Only show item bundle without individual components and do not split the item bundle in the order process',
        value: '1',
      },
      {
        text: 'List both the item bundle and its individual components',
        value: '2',
      },
    ];

    expectedTextsAndValues.forEach((option) => {
      this.itemBundlesSelect.select(option.text).should('have.value', option.value);

      this.itemBundlesSelect.find('option:selected').should('have.text', option.text);
    });
    return this;
  }

  checkVisibilityOfBundleComponentsOnItemPage() {
    this.visibleBundleComponents('bundle-components-list');
    this.notVisibleBundleComponents('bundle-components-list');
    return this;
  }

  addBundleToCartAndVisitCartPage() {
    this.openDrawer();
    cy.getByTestId('add-to-cart').click();
    this.delay(1500);
    cy.visit('/cart');
    return this;
  }
  checkVisibilityOfBundleComponentsOnCart() {
    this.openDrawer();
    this.visibleBundleComponents('cart-product-card-bundle-components-list');
    this.notVisibleBundleComponents('cart-product-card-bundle-components-list');
    return this;
  }

  checkVisibilityOfBundleComponentsOnCheckout() {
    cy.visit('/checkout');
    this.delay(1500);
    this.openDrawer();
    this.visibleBundleComponents('cart-product-card-bundle-components-list');
    this.notVisibleBundleComponents('cart-product-card-bundle-components-list');
    return this;
  }

  visibleBundleComponents(list: string) {
    const options = [
      'Only list the components of the item bundle and replace the item bundle with the basic items in the order process',
      'List both the item bundle and its individual components',
    ];
    options.forEach((option) => {
      this.itemBundlesSelect.select(option);
      cy.getByTestId(list).children().should('have.length', 3);
    });
  }

  notVisibleBundleComponents(list: string) {
    this.itemBundlesSelect.select(
      'Only show item bundle without individual components and do not split the item bundle in the order process',
    );
    cy.getByTestId(list).should('not.exist');
  }

  openDrawer() {
    this.delay(1500);
    cy.getByTestId('sell').click();
    cy.getByTestId('item-bundles-section').click();
  }
}
