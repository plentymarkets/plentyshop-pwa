import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { CategorySettingsObject } from '../../../../../support/pageObjects/CategorySettingsObject';

describe('RecommendedSorting', () => {
  const editor = new EditorObject();
  const categorySettings = new CategorySettingsObject();
  const cookieBar = new CookieBarObject();
  const categoryPage = '/living-room';

  beforeEach(() => {
    cy.clearCookies();
    //1. Go to Living room category page
    cy.visit(categoryPage);
    cookieBar.acceptAll();
  });

  //2. Sidebar opens when user clicks on icon
  it('should check sidebar opens when user clicks on icon', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings.checkDrawerVisible().delay(500).closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

  //3. Drawer of Recommended Sorting opens
  it('should open the recommended sorting section', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings.checkDrawerVisible().delay(500).toggleRecommendedSortingSection().closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

  //5. Check default values are selected
  //6. Check for all of the 3 dropdown the options exists
  it('should check that options exist in all three options dropdown', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
      .checkDrawerVisible()
      .delay(500)
      .toggleRecommendedSortingSection()
      .checkSelectsExist()
      .checkCorrectNumberOfSortingOptions()
      .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });
});
