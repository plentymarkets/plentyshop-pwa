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
  const horizontalSpacing = 'm';
  const horizontalClass = 'max-w-screen-2xl';
  const verticalSpacing = 'm';

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
      .delay(500)
      .openDesignSubcategory()
      .toggleFonts()
      .changeFont(font)
      .checkFontPreview(font)
      .checkSaveButtonEnabled()
      .back()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  it('should change the theme colors', () => {
    editor.isToolbarVisible();
    editor.toggleDesignSettings();

    siteSettings
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .delay(500)
      .openDesignSubcategory()
      .toggleColor()
      .changeColor(primaryColor, secondaryColor)
      .checkColorPreview(primaryColor)
      .checkSaveButtonEnabled()
      .back()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  it('should change the spacing', () => {
    editor.isToolbarVisible();
    editor.toggleDesignSettings();

    siteSettings
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .delay(500)
      .openDesignSubcategory()
      .toggleBlockSpacing()
      .changeBlockVerticalSpacing(verticalSpacing)
      .changeBlockHorizontalSpacing(horizontalSpacing)
      .checkBlockVerticalSpacingPreview(verticalSpacing)
      .checkBlockHorizontalSpacingPreview(horizontalClass)
      .checkSaveButtonEnabled()
      .back()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });

  it('should change custom scripts', () => {
    editor.isToolbarVisible();
    siteSettings
      .toggleCustomScriptsSettings()
      .checkDrawerVisible()
      .checkSaveButtonDisabled()
      .delay(500)
      .checkCustomCodeHeader()
      .changeCustomScript()
      .checkScriptPlacementFooter()
      .checkSaveButtonEnabled()
      .checkScriptPlacementHeader()
      .back()
      .closeDrawer();

    siteSettings.checkDrawerNotVisible();
  });
});
