import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { paths } from '../../../../../../utils/paths';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { SiteSettingsObject } from '../../../../../support/pageObjects/SiteSettingsObject';

describe('ItemBundles', () => {
  const editor = new EditorObject();
  const siteSettings = new SiteSettingsObject();
  const cookieBar = new CookieBarObject();
  const bundlePage = '/wear/shoe-bundle_175_1173';

  beforeEach(() => {
    cy.clearCookies();
    //1. Go to item bundles page
    cy.visit(bundlePage);
    cookieBar.acceptAll();
  });

  //2. Sidebar opens when user clicks on icon
  it('should check sidebar opens when user clicks on icon', () => {
    editor.isToolbarVisible();
    editor.toggleItemSettings();

    siteSettings
      .checkDrawerVisible()
      .delay(500)
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  //3. Drawer of Item Bundles opens
  //4. Check that dropdown exists and it has the bundleSettingsOptions
  it('should open the Item Bundles section and it has the bundleSettingsOptions', () => {
    editor.isToolbarVisible();
    editor.toggleItemSettings();

    siteSettings
        .checkDrawerVisible()
        .delay(500)
        .toggleItemBundlesSection()
        .checkOptionsExist()
        .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  //6. On the item page that contains a bundle when changing the options the bundle components are shown or not
  it('should check the visibility of bundle components based on dropdown select on item page', () => {
    editor.isToolbarVisible();
    editor.toggleItemSettings();

    siteSettings
        .checkDrawerVisible()
        .delay(500)
        .toggleItemBundlesSection()
        .checkVisibilityOfBundleComponentsOnItemPage()
        .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  //10. Change the options and check in cart and first step of checkout that the bundle components are shown or not
  it('should check the visibility of bundle components based on dropdown select on cart and checkout', () => {
    siteSettings.addBundleToCartAndVisitCartPage();

    siteSettings
        .checkVisibilityOfBundleComponentsOnCart()
        .checkVisibilityOfBundleComponentsOnCheckout()
        .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });
});
