import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import { SiteSettingsObject } from '../../support/pageObjects/SiteSettingsObject';
import { SeoSettingsObject } from '../../support/pageObjects/SeoSettingsObject';

describe('SiteSettings', () => {
  const editor = new EditorObject();
  const siteSettings = new SiteSettingsObject();
  const seoSettings = new SeoSettingsObject();
  const cookieBar = new CookieBarObject();

  const font = 'Almarai';
  const primaryColor = '#11ff00';
  const secondaryColor = '#c3c3c3';
  const horizontalSpacing = 'm';
  const horizontalClass = 'max-w-screen-2xl';
  const verticalSpacing = 'm';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
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

  it('should keep site settings scrollable across different viewport heights', () => {
    const viewportSizes: Array<[number, number]> = [
      [1512, 982], // MacBook Pro 14"
      [1728, 1117], // MacBook Pro 16"
      [2560, 1440], // 32" QHD / scaled 4K
      [3840, 2160], // 32" 4K UHD
    ];

    viewportSizes.forEach(([width, height]) => {
      cy.viewport(width, height);

      editor.isToolbarVisible();
      editor.toggleSeoSettings();

      seoSettings.checkDrawerVisible().delay(500).selectSearchEnginesSubcategory();

      siteSettings.assertGroupsScrollable();

      seoSettings.goBackSection().closeDrawer().checkDrawerNotVisible();
    });
  });
});
