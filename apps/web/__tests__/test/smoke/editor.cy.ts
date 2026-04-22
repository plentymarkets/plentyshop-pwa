import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { HeaderBlockObject } from '../../support/pageObjects/HeaderBlockObject';
import { FooterBlockObject } from '../../support/pageObjects/FooterBlockObject';
import { TableOfContentsObject } from '../../support/pageObjects/TableOfContentsObject';
import { ToolbarObject } from '../../support/pageObjects/ToolbarObject';

const cookieBar = new CookieBarObject();
const headerBlock = new HeaderBlockObject();
const footerBlock = new FooterBlockObject();
const tableOfContents = new TableOfContentsObject();
const toolbar = new ToolbarObject();

describe('Editor Smoke Tests', () => {
  it('global blocks editor interactions', () => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();

    // prettier-ignore
    tableOfContents
      .openTableOfContents()
      .checkTableOfContentsVisible()
      .checkBlocksExist()
      .checkFirstBlockLabel('Header')
      .checkLastBlockLabel('Footer');

    headerBlock.assertNotMovableOrDeletable();

    // prettier-ignore
    headerBlock
      .openHeaderContainerForm()
      .assertChildrenListedWithActions()
      .openChildMenu()
      .closeChildMenu();

    toolbar.assertSaveDisabled();

    // prettier-ignore
    headerBlock
      .editNavigationChild()
      .storeNavigationBackgroundColor()
      .changeNavigationBackgroundColor('#ff0000');

    toolbar.assertSaveEnabled();

    headerBlock.restoreNavigationBackgroundColor();
    toolbar.assertSaveDisabled();

    // prettier-ignore
    headerBlock
      .goBackToHeaderContainerForm()
      .assertHeaderIsNotSticky()
      .toggleSticky()
      .assertHeaderIsSticky()
      .toggleSticky()
      .assertHeaderIsNotSticky();

    // prettier-ignore
    headerBlock
      .addElement()
      .selectTextBlockToAdd();

    // prettier-ignore
    headerBlock
      .openHeaderContainerForm()
      .assertChildCount(3)
      .editLastChild();

    // prettier-ignore
    headerBlock
      .typeButtonLabel('Smoke Test Button')
      .assertButtonLabelOnPage('Smoke Test Button');

    // prettier-ignore
    footerBlock
      .assertNotMovableOrDeletable()
      .openSettingsDrawer()
      .assertSettingsSections()
      .assertColumnInteractive()
      .changeColumnTitle('Smoke Legal')
      .assertColumnTitleValue('Smoke Legal');
  });
});
