import { CookieBarObject } from '../../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../../support/pageObjects/EditorObject';
import { SiteSettingsObject } from '../../../../../support/pageObjects/SiteSettingsObject';
import {GeneralSettingsObject} from "../../../../../support/pageObjects/GeneralSettingsObject";

describe('DefaultB2CCustomerClass', () => {
  const editor = new EditorObject();
  const siteSettings = new SiteSettingsObject();
  const generalSettings = new GeneralSettingsObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/');
    cookieBar.acceptAll();
  });

  //Sidebar opens when user clicks on icon
  it('should check sidebar opens when user clicks on icon', () => {
    editor.isToolbarVisible();
    editor.toggleGeneralSettings();

    siteSettings.checkDrawerVisible().delay(500).closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  // Check that dropdown exists
  it('should open the Default B2C section and it has a dropdown', () => {
    editor.isToolbarVisible();
    editor.toggleGeneralSettings();

    generalSettings
        .checkDrawerVisible()
        .delay(500)
        .toggleCustomerManagement()
        .toggleSection('b2c')
        .checkDropdownExist('b2c-customer-class-select')
        .goBackSection()
        .closeDrawer();

    generalSettings.checkDrawerNotVisible();
  });

  it('should open the Default B2B section and it has a dropdown', () => {
    editor.isToolbarVisible();
    editor.toggleGeneralSettings();

    generalSettings
        .checkDrawerVisible()
        .delay(500)
        .toggleCustomerManagement()
        .toggleSection('b2b')
        .checkDropdownExist('b2b-customer-class-select')
        .goBackSection()
        .closeDrawer();

    generalSettings.checkDrawerNotVisible();
  });
});
