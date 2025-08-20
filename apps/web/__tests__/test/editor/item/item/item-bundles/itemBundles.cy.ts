import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { paths } from '../../../../../../utils/paths';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { SiteSettingsObject } from '../../../../../support/pageObjects/SiteSettingsObject';

describe('ItemBundles', () => {
  const editor = new EditorObject();
  const siteSettings = new SiteSettingsObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/livingroom');
    cookieBar.acceptAll();
  });

  it('should display options for item bundles', () => {
    editor.isToolbarVisible();
    editor.toggleItemSettings();

    siteSettings
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .delay(500)
      .toggleItemBundlesSection()
      .checkOptionsExist()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });
});
