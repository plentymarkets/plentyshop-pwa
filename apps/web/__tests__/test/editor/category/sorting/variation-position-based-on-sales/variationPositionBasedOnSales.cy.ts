import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { CategorySettingsObject } from '../../../../../support/pageObjects/CategorySettingsObject';

describe('RecommendedSorting', () => {
  const editor = new EditorObject();
  const categorySettings = new CategorySettingsObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    //1. Go to Living room category page
    cy.visit('/');
    cookieBar.acceptAll();
  });

  //Sidebar opens when user clicks on icon
  it('should check sidebar opens when user clicks on icon', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings.checkDrawerVisible().delay(500).closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

  //Drawer of variation position based on sales opens
  it('should open the variation position based on sales section', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings.checkDrawerVisible().delay(500).toggleRecommendedSortingSection().closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

  //Check that the toggle exist
  it('should check that variation position toggle exist', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
      .checkDrawerVisible()
      .delay(500)
      .toggleVariationPositionSection()
      .checkToggleExist()
      .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });
});
