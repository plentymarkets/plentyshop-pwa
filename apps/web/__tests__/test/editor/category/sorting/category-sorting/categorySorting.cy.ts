import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { CategorySettingsObject } from '../../../../../support/pageObjects/CategorySettingsObject';

describe('CategorySorting', () => {
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

    categorySettings
      .checkDrawerVisible()
      .delay(500)
      .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

  //3. Drawer of Category Sorting opens
  //6. Check the text from the info icons for both of sorting options
  it('should open the category sorting section and check tooltip text', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
        .checkDrawerVisible()
        .delay(500)
        .toggleCategorySortingSection()
        .checkTooltip('available-sorting-option-tooltip', 'Which of the following sorting options do you want to make available to your customers in the category view?')
        .checkTooltip('default-sorting-tooltip', 'Which sorting option do you want to preselect by default for the category view?')
        .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

  //4. Available Sorting Options and Default Sorting selects exists
  //7. Check all the sorting options texts and values exists
  //8. Upon changing the Available Sorting Options the SORT BY from the page dropdown selects changes
  it('should check that Available Sorting Options and Default Sorting selects exists with options', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
        .checkDrawerVisible()
        .delay(500)
        .toggleCategorySortingSection()
        .checkCategorySelectsExist()
        .checkCategoryOptions()
        .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });
});
