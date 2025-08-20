import { PageObject } from './PageObject';

export const firstBannerBlockUuid = 'a7b3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d';

export class EditorObject extends PageObject {
  get pretitle() {
    return cy.getByTestId(`banner-pretitle-${firstBannerBlockUuid}`);
  }

  get title() {
    return cy.getByTestId(`banner-title-${firstBannerBlockUuid}`);
  }

  get subtitle() {
    return cy.getByTestId(`banner-subtitle-${firstBannerBlockUuid}`);
  }

  get description() {
    return cy.getByTestId(`banner-description-${firstBannerBlockUuid}`);
  }

  get editorToolbar() {
    return cy.getByTestId('edit-mode-toolbar');
  }

  get editPreviewButton() {
    return cy.getByTestId('edit-preview-button');
  }

  get editBlockActions() {
    return cy.getByTestId('edit-block-actions');
  }

  get openEditorButton() {
    return cy.getByTestId('open-editor-button');
  }

  get editorTextarea() {
    return cy.getByTestId('editor-textarea');
  }

  get exitEditorButton() {
    return cy.get('#close');
  }

  get blockWrappers() {
    return cy.get('[data-testid*="block-wrapper"]');
  }

  get blocksAccordionImage() {
    return cy.get('[data-testid*="block-category-image-with-text"]');
  }

  get topBlockButton() {
    return cy.getByTestId('top-add-block');
  }

  get bottomBlockButton() {
    return cy.getByTestId('bottom-add-block');
  }

  get deleteBlockButton() {
    return cy.getByTestId('delete-block-button');
  }

  get topMoveBlockButton() {
    return cy.getByTestId('move-up-button');
  }

  get bottomMoveBlockButton() {
    return cy.getByTestId('move-down-button');
  }

  get recommendedProducts() {
    return cy.getByTestId('product-slider');
  }

  get languageSwitcher() {
    return cy.getByTestId('editor-language-select');
  }

  get addBlockButton() {
    return cy.getByTestId('block-add-image-with-text-0');
  }

  get designSettingsButton() {
    return cy.getByTestId('open-design-drawer');
  }

  get itemSettingsButton() {
    return cy.getByTestId('open-item-settings-drawer');
  }

  get categorySettingsButton() {
    return cy.getByTestId('open-category-drawer');
  }

  blockIsBanner(el: JQuery<HTMLElement>) {
    return el[0].innerHTML.includes('banner-image');
  }

  blockIsNewsletter(el: JQuery<HTMLElement>) {
    return el[0].innerHTML.includes('newsletter-block');
  }

  blockIsFooter(el: HTMLElement) {
    return el.innerHTML.includes('footer');
  }

  togglePreviewMode() {
    this.editPreviewButton.should('be.enabled').click();
    this.editPreviewButton.should('contain.text', 'Preview');
    return this;
  }
  toggleEditMode() {
    this.editPreviewButton.should('be.enabled').click();
    this.editPreviewButton.should('contain.text', 'Edit');
    return this;
  }

  toggleDesignSettings() {
    this.designSettingsButton.should('be.visible').click();
    return this;
  }

  toggleItemSettings() {
    this.itemSettingsButton.should('be.visible').click();
    return this;
  }

  toggleCategorySettings() {
    this.categorySettingsButton.should('be.visible').click();
    return this;
  }

  isToolbarVisible() {
    this.editorToolbar.should('be.visible');
  }

  assertEditBlockActionsNotVisible() {
    this.editBlockActions.should('not.be.visible');
    return this;
  }

  openEditor() {
    this.openEditorButton.click();
    return this;
  }

  clearAndTypeInEditor(content: string) {
    this.editorTextarea.clear().type(content, { parseSpecialCharSequences: false });
    return this;
  }

  assertEditorContent(content: string) {
    this.editorTextarea.should('have.value', content);
    return this;
  }

  checkEditorContent() {
    this.openEditorButton.first().click({ force: true });

    cy.get('body', { timeout: 30000 })
      .find('[data-testid="editor-textarea"]')
      .should('exist')
      .and('be.visible')
      .invoke('attr', 'placeholder')
      .should('not.be.empty');
  }

  replaceEditorContent(content: string) {
    this.editorTextarea
      .should('be.visible')
      .then(($el) => {
        if ($el.prop('isContentEditable')) {
          cy.wrap($el).invoke('text', '');
        } else {
          cy.wrap($el).clear();
        }
      })
      .type(content, { delay: 0 })
      .should('have.value', content);
  }

  checkEditorChanges() {
    this.exitEditorButton.get('#close').click({ force: true });
    this.pretitle.should('have.text', 'New pretitle from cypress');
    this.title.should('have.text', 'New title from cypress');
    this.subtitle.should('not.exist');
    this.description.should('have.text', 'Description from cypress.');
  }

  buttonsExistWithGroupClasses() {
    this.blockWrappers.first().should('exist').and('have.class', 'group').and('not.have.css', 'outline-style', 'solid');
    this.blockWrappers.first().within(() => {
      this.topBlockButton
        .should('exist')
        .and('have.class', 'group-hover:opacity-100')
        .and('have.class', 'group-focus:opacity-100');
      this.bottomBlockButton
        .should('exist')
        .and('have.class', 'group-hover:opacity-100')
        .and('have.class', 'group-focus:opacity-100');
      this.editBlockActions
        .should('exist')
        .and('have.class', 'group-hover:opacity-100')
        .and('have.class', 'group-focus:opacity-100');
    });
  }

  deleteBlock() {
    this.blockWrappers.then((initialBlocks) => {
      const initialLength = initialBlocks.length;
      this.blockWrappers.first().should('exist');
      this.deleteBlockButton.eq(1).click();
      cy.wait(1000);
      this.blockWrappers.should('have.length', initialLength - 1);
    });
  }

  recommendedProductsExist() {
    this.recommendedProducts.should('exist');
  }

  switchLanguage() {
    cy.intercept('/plentysystems/getCart').as('getCart');
    cy.intercept('/plentysystems/getCategoryTree').as('getCategoryTree');
    cy.intercept('/plentysystems/getFacet').as('getFacet');

    this.editPreviewButton.click();
    this.languageSwitcher.should('exist');
    this.languageSwitcher.select('de');
    cy.wait(['@getCart', '@getCategoryTree', '@getFacet']);
    this.title.first().should('have.text', 'Ihr Sound');
  }

  addBlockTop() {
    this.blockWrappers.then((initialBlocks) => {
      const initialLength = initialBlocks.length;
      this.topBlockButton.invoke('removeClass', 'opacity-0');
      this.topBlockButton.first().should('exist').click();
      cy.wait(1000);
      this.blocksAccordionImage.should('exist').click();
      cy.wait(1000);
      this.addBlockButton.should('exist').click();
      cy.wait(1000);
      this.blockWrappers.should('have.length', initialLength + 1);
    });
  }

  addBlockBottom() {
    this.blockWrappers.then((initialBlocks) => {
      const initialLength = initialBlocks.length;
      this.bottomBlockButton.invoke('removeClass', 'opacity-0');
      this.bottomBlockButton.first().should('exist').click();
      cy.wait(1000);
      this.blocksAccordionImage.should('exist').click();
      cy.wait(1000);
      this.addBlockButton.click();
      cy.wait(1000);
      this.blockWrappers.should('have.length', initialLength + 1);
    });
  }

  checkFirstBlock() {
    this.blockWrappers.first().within(() => {
      this.topMoveBlockButton.first().should('exist').and('be.disabled').and('have.class', 'cursor-not-allowed');
    });
  }

  checkLastNonFooterBlock() {
    this.blockWrappers.then(($blocks) => {
      let lastNonFooterIndex = -1;
      $blocks.each((i, el) => {
        if (!this.blockIsFooter(el)) {
          lastNonFooterIndex = i;
        }
      });
      cy.wrap($blocks[lastNonFooterIndex]).within(() => {
        this.bottomMoveBlockButton.first().should('exist').and('be.disabled').and('have.class', 'cursor-not-allowed');
      });
    });
  }

  checkFooterBlock() {
    this.blockWrappers.last().within(() => {
      this.topMoveBlockButton.should('not.exist');
      this.bottomMoveBlockButton.should('not.exist');
      this.deleteBlockButton.should('not.exist');
    });
  }

  assertDefaultBlockOrder() {
    this.blockWrappers.first().should('contain.text', 'Feel the music').next().should('contain.text', 'Discover Tech');
  }

  moveBlock() {
    this.blockWrappers.first().within(() => {
      this.bottomMoveBlockButton.first().should('exist').click();
    });
  }

  assertChangedBlockOrder() {
    this.blockWrappers.first().should('contain.text', 'Discover Tech').next().should('contain.text', 'Feel the music');
  }

  checkWrapperSpacings() {
    this.blockWrappers.each((el) => {
      if (this.blockIsBanner(el) || this.blockIsNewsletter(el) || this.blockIsFooter(el.get(0))) {
        cy.wrap(el).should('not.have.class', 'px-4').and('not.have.class', 'md:px-6');
        cy.wrap(el).should('not.have.class', 'px-4').and('not.have.class', 'md:px-6');
      } else {
        cy.wrap(el).should('have.class', 'px-4').and('have.class', 'md:px-6');
      }
    });
  }
}
