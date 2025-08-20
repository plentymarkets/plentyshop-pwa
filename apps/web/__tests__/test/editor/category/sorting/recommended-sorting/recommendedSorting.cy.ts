import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { CategorySettingsObject } from '../../../../../support/pageObjects/CategorySettingsObject';
import {paths} from "../../../../../../utils/paths";

describe('RecommendedSorting', () => {
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


  it('should open the recommended sorting section and check tooltip text', () => {
    editor.isToolbarVisible();
    editor.toggleCategorySettings();

    categorySettings
        .checkDrawerVisible()
        .delay(500)
        .toggleRecommendedSortingSection()
        .checkTooltip()
        .closeDrawer();

    categorySettings.checkDrawerNotVisible();
  });

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
