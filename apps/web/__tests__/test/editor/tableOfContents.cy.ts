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
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    editor.isToolbarVisible();
  });

  it('should open table of contents and display all blocks', () => {
    toc.openTableOfContents();
    toc.checkTableOfContentsVisible();
    toc.checkBlocksExist();
    toc.checkBlockIconsExist();
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

  it('should toggle block visibility with eye icon', () => {
    toc.openTableOfContents();
    toc.checkVisibilityIconExists();
    toc.toggleBlockVisibility();
    toc.checkBlockIsGrayedOut();
    toc.checkBlockNotVisibleOnPage();
    toc.toggleBlockVisibility();
    toc.checkBlockIsNotGrayedOut();
    toc.checkBlockVisibleOnPage();
  });

  it('should delete block via delete icon', () => {
    toc.openTableOfContents();
    toc.checkDeleteIconExists();
    toc.deleteBlockFromToc();
    toc.checkBlockDeletedFromToc();
  });

  it('should open both drawers and scroll to block when clicking on toc element', () => {
    toc.openTableOfContents();
    toc.clickOnBlockInToc(1);
    toc.checkBlockIsVisibleOnScreen();
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
