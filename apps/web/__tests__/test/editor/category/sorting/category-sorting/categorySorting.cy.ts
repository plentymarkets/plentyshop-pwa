import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { CategorySettingsObject } from '../../../../../support/pageObjects/CategorySettingsObject';

describe('CategorySorting', () => {
  const editor = new EditorObject();
  const categorySettings = new CategorySettingsObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/livingroom');
    cookieBar.acceptAll();
  });

  it('should check sidebar opens when user clicks on icon', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
      .checkDrawerVisible()
      .delay(500)
      .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });


  it('should open the category sorting section and check tooltip text', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
        .checkDrawerVisible()
        .delay(500)
        .toggleCategorySortingSection()
        .checkTooltip()
        .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });
});
