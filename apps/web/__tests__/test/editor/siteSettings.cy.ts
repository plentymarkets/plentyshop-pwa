import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import { SiteSettingsObject } from '../../support/pageObjects/SiteSettingsObject';

describe('SiteSettings', () => {
  const editor = new EditorObject();
  const siteSettings = new SiteSettingsObject();
  const cookieBar = new CookieBarObject();

  const font = 'Almarai';
  const primaryColor = '#11ff00';
  const secondaryColor = '#c3c3c3';
  const blockSpacing = 'l';
  const blockSpacingMargin = '30';

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should change the font', () => {
    editor.isToolbarVisible();
    editor.toggleDesignSettings();

    siteSettings
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .toggleFonts()
      .changeFont(font)
      .checkFontPreview(font)
      .checkSaveButtonEnabled()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  it('should change the theme colors', () => {
    editor.isToolbarVisible();
    editor.toggleDesignSettings();

    siteSettings
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .toggleColor()
      .changeColor(primaryColor, secondaryColor)
      .checkColorPreview(primaryColor)
      .checkSaveButtonEnabled()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  it('should change the spacing', () => {
    editor.isToolbarVisible();
    editor.toggleDesignSettings();

    siteSettings
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .toggleBlockSpacing()
      .changeBlockSpacing(blockSpacing)
      .checkBlockSpacingPreview(blockSpacingMargin)
      .checkSaveButtonEnabled()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });
});
