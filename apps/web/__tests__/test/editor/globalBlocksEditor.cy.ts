import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { HeaderBlockObject } from '../../support/pageObjects/HeaderBlockObject';
import { FooterBlockObject } from '../../support/pageObjects/FooterBlockObject';
import { TableOfContentsObject } from '../../support/pageObjects/TableOfContentsObject';
import { ToolbarObject } from '../../support/pageObjects/ToolbarObject';
import { BlocksArchitectureObject } from '../../support/pageObjects/BlocksArchitectureObject';
import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';

const cookieBar = new CookieBarObject();
const headerBlock = new HeaderBlockObject();
const languageSelect = new LanguageSelectObject();
const footerBlock = new FooterBlockObject();
const tableOfContents = new TableOfContentsObject();
const toolbar = new ToolbarObject();
const blocks = new BlocksArchitectureObject();

const setupEditor = () => {
  cy.clearCookies();
  cy.clearConfig();
  cy.setConfig({ isPreview: true });
  cy.visitAndHydrate(paths.home);
  cookieBar.acceptAll();
};

const setupEditorOnCategory = () => {
  setupEditor();
  headerBlock.navigateToCategory();
};

describe('Global Blocks Editor', () => {
  describe('footer editability rules', () => {
    it('footer can be edited on index page', () => {
      setupEditor();

      // prettier-ignore
      tableOfContents
        .openTableOfContents()
        .checkTableOfContentsVisible();

      // prettier-ignore
      footerBlock
        .openSettingsDrawer()
        .assertSettingsSections();
    });

    it('footer cannot be deleted or reordered', () => {
      setupEditor();
      footerBlock.assertNotMovableOrDeletable();
    });

    it('footer is not editable on category page', () => {
      setupEditorOnCategory();
      footerBlock.assertNotEditableOnPage();
    });
  });

  describe('header editability rules', () => {
    it('header container can be edited on index page', () => {
      setupEditor();

      // prettier-ignore
      tableOfContents
        .openTableOfContents()
        .checkTableOfContentsVisible();

      // prettier-ignore
      headerBlock
        .openHeaderContainerForm()
        .assertChildrenListedWithActions();
    });

    it('header container cannot be deleted or reordered', () => {
      setupEditor();
      headerBlock.assertNotMovableOrDeletable();
    });

    it('header is not editable on category page', () => {
      setupEditorOnCategory();
      headerBlock.assertNotEditableOnPage();
    });
  });

  describe('content <-> form sync', () => {
    it('footer form edits reflect on page and enable save button', () => {
      setupEditor();

      toolbar.assertSaveDisabled();

      // prettier-ignore
      tableOfContents
        .openTableOfContents()
        .checkTableOfContentsVisible();

      // prettier-ignore
      footerBlock
        .openSettingsDrawer()
        .changeColumnTitle('E2E Footer Title');

      toolbar.assertSaveEnabled();
      footerBlock.assertColumnTitleValue('E2E Footer Title');
    });

    it('header container child form edits enable save button', () => {
      setupEditor();

      toolbar.assertSaveDisabled();

      // prettier-ignore
      tableOfContents
        .openTableOfContents()
        .checkTableOfContentsVisible();

      // prettier-ignore
      headerBlock
        .openHeaderContainerForm()
        .editNavigationChild()
        .storeNavigationBackgroundColor()
        .changeNavigationBackgroundColor('#ff0000');

      toolbar.assertSaveEnabled();

      headerBlock.restoreNavigationBackgroundColor();
      toolbar.assertSaveDisabled();
    });
  });

  describe('save and reload', () => {
    it('edited footer persists after save and reload', () => {
      blocks.interceptSave();
      setupEditor();

      // prettier-ignore
      tableOfContents
        .openTableOfContents()
        .checkTableOfContentsVisible();

      // prettier-ignore
      footerBlock
        .openSettingsDrawer()
        .changeColumnTitle('Saved Footer Title');

      toolbar.assertSaveEnabled();
      toolbar.clickSave();
      blocks.waitForSave();

      blocks.interceptSaved();
      cy.visitAndHydrate(paths.home);
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertFooterVisible()
        .assertFooterContainsText('Saved Footer Title');
    });
  });
});
