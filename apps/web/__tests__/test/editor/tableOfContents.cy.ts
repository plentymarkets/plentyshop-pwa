import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import { TableOfContentsObject } from '../../support/pageObjects/TableOfContentsObject';

describe('Table of Contents & Double Drawer', () => {
  const editor = new EditorObject();
  const toc = new TableOfContentsObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    editor.isToolbarVisible();
  });

  it('should open table of contents and display all blocks', () => {
    toc.openTableOfContents();
    toc.checkTableOfContentsVisible();
    toc.checkBlocksExist();
  });

  it('should show collapsible arrows for structure blocks', () => {
    toc.openTableOfContents();
    toc.checkCollapsibleArrowForStructureBlocks();
  });

  it('should expand and collapse structure block children', () => {
    toc.openTableOfContents();
    toc.expandStructureBlock();
    toc.checkChildrenVisible();
    toc.collapseStructureBlock();
    toc.checkChildrenHidden();
  });

  it('should display delete and visibility icons for blocks', () => {
    toc.openTableOfContents();
    toc.checkDeleteIconExists();
    toc.checkVisibilityIconExists();
  });

  it('should toggle block visibility with eye icon', () => {
    toc.openTableOfContents();
    toc.toggleBlockVisibility();
    toc.checkBlockIsGrayedOut();
    toc.checkBlockNotVisibleOnPage();
    toc.toggleBlockVisibility();
    toc.checkBlockIsNotGrayedOut();
    toc.checkBlockVisibleOnPage();
  });

  it('should delete block via delete icon', () => {
    toc.openTableOfContents();
    cy.get('[data-testid^="toc-item-"]').then(($items) => {
      const initialBlockCount = $items.length;
      toc.deleteBlockFromToc();
      toc.checkBlockDeletedFromToc(initialBlockCount);
      cy.get('[data-testid^="toc-item-"]').should('have.length', initialBlockCount - 1);
    });
  });

  it('should scroll to block when clicking on it in TOC', () => {
    toc.openTableOfContents();
    toc.clickOnBlockInToc(1);
    toc.checkBlockIsVisibleOnScreen();
  });

  it('should open double drawer when clicking on block', () => {
    toc.openTableOfContents();
    toc.clickOnBlockInToc(0);
    toc.checkBothDrawersVisible();
    toc.checkBlocksConfigurationDrawerOpen();
  });

  it('should add new block via add element button', () => {
    toc.openTableOfContents();
    cy.get('[data-testid^="toc-item-"]').then(($items) => {
      const initialBlockCount = $items.length;
      toc.clickAddElement();
      toc.checkPlaceholderAppears();
      toc.selectBlockToAdd();
      toc.checkBlockAdded(initialBlockCount);
    });
    toc.checkBothDrawersStillVisible();
  });
});

