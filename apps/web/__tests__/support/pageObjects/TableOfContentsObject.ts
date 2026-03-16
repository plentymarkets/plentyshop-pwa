import { PageObject } from './PageObject';

export class TableOfContentsObject extends PageObject {
  get tableOfContentsButton() {
    return cy.getByTestId('open-table-of-contents-drawer');
  }

  get tableOfContentsDrawer() {
    return cy.getByTestId('blocks-overview-drawer');
  }

  get blocksConfigurationDrawer() {
    return cy.getByTestId('block-edit-view');
  }

  get siteConfigurationDrawer() {
    return cy.getByTestId('site-settings-drawer');
  }

  get tableOfContentsItems() {
    return cy.get('[data-testid^="toc-item-"]');
  }

  get tableOfContentsItemLabel() {
    return cy.get('[data-testid="toc-label"]');
  }

  get deleteIcons() {
    return cy.get('[data-testid^="toc-delete-"]');
  }

  get visibilityIcons() {
    return cy.get('[data-testid^="toc-visibility-"]');
  }

  get addElementButton() {
    return cy.getByTestId('toc-add-block');
  }

  openTableOfContents() {
    this.tableOfContentsButton.should('be.visible').click();
    return this;
  }

  checkTableOfContentsVisible() {
    this.tableOfContentsDrawer.should('be.visible');
    return this;
  }

  checkBlocksExist() {
    this.tableOfContentsItems.should('have.length.greaterThan', 0);
    return this;
  }

  checkCollapsibleArrowForStructureBlocks() {
    cy.get('[data-testid^="toc-item-"] button').should('have.length.greaterThan', 0);
    return this;
  }

  expandStructureBlock() {
    this.tableOfContentsItems.its('length').as('tocItemCountBeforeExpand');
    cy.get('[data-testid^="toc-item-"] button').first().click({ force: true });
    cy.wait(300);
    return this;
  }

  checkChildrenVisible() {
    this.tableOfContentsItems.should('have.length.greaterThan', 1);
    return this;
  }

  collapseStructureBlock() {
    cy.get('[data-testid^="toc-item-"] button').first().click({ force: true });
    cy.wait(300);
    return this;
  }

  checkChildrenHidden() {
    cy.get<number>('@tocItemCountBeforeExpand').then((initialCount) => {
      this.tableOfContentsItems.should('have.length', initialCount);
    });
    return this;
  }

  checkDeleteIconExists() {
    this.deleteIcons.should('have.length.greaterThan', 0);
    return this;
  }

  checkVisibilityIconExists() {
    this.visibilityIcons.should('have.length.greaterThan', 0);
    return this;
  }

  toggleBlockVisibility() {
    this.visibilityIcons.eq(1).click({ force: true });
    cy.wait(800);
    return this;
  }

  checkBlockIsGrayedOut() {
    this.tableOfContentsItemLabel.eq(1).should('have.class', 'opacity-50');
    return this;
  }

  checkBlockNotVisibleOnPage() {
    cy.get('[data-testid^="banner-image-"]').should('not.exist');
    return this;
  }

  checkBlockIsNotGrayedOut() {
    this.tableOfContentsItems.eq(1).should('not.have.class', 'opacity-50');
    return this;
  }

  checkBlockVisibleOnPage() {
    cy.get('[data-testid^="banner-image-"]').should('exist');
    return this;
  }

  deleteBlockFromToc() {
    this.deleteIcons.eq(1).click({ force: true });
    cy.wait(500);
    return this;
  }

  checkBlockDeletedFromToc() {
    this.tableOfContentsItems.should('not.contain', 'Carousel');
    return this;
  }

  clickOnBlockInToc(index: number) {
    this.tableOfContentsItems.eq(index).click({ force: true });
    cy.wait(500);
    return this;
  }

  checkBlockIsVisibleOnScreen() {
    cy.getByTestId('block-wrapper').eq(0).should('be.visible');
    return this;
  }

  checkBothDrawersVisible() {
    this.tableOfContentsDrawer.should('be.visible');
    this.blocksConfigurationDrawer.should('be.visible');
    return this;
  }

  checkBlocksConfigurationDrawerOpen() {
    this.blocksConfigurationDrawer.within(() => {
      cy.getByTestId('close-editor-button').should('be.visible');
    });
    return this;
  }

  clickAddElement() {
    this.addElementButton.should('be.visible').click();
    cy.wait(500);
    return this;
  }

  checkPlaceholderAppears() {
    cy.getByTestId('block-placeholder').should('be.visible');
    return this;
  }

  selectBlockToAdd() {
    cy.getByTestId('block-category-text').click({ force: true });
    cy.wait(500);

    cy.get(`[data-testid*="block-add-text-0"]`).click({ force: true });
    cy.wait(1000);
    return this;
  }

  checkBlockAdded(initialCount: number) {
    cy.get('[data-testid^="toc-item-"]').should('have.length', initialCount + 1);
    return this;
  }

  checkBothDrawersStillVisible() {
    this.tableOfContentsDrawer.should('be.visible');
    this.blocksConfigurationDrawer.should('be.visible');
    return this;
  }
}
