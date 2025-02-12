import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import { SiteSettingsObject } from '../../support/pageObjects/SiteSettingsObject';

describe('SiteSettings', () => {
  const editor = new EditorObject();
  const siteSettings = new SiteSettingsObject();

  const font = 'Almarai';
  const primaryColor = '#11ff00';
  const secondaryColor = '#c3c3c3';
  const blockSpacing = 'l';
  const blockSpacingMargin = '30';

  beforeEach(() => {
    cy.intercept('/plentysystems/setConfiguration').as('setConfiguration');

    cy.visitAndHydrate(paths.home);
  });

  it('should test site settings', () => {
    editor.isToolbarVisible();
    editor.toggleEditMode();
    editor.toggleSiteSettings();
    siteSettings
      .checkDrawerVisible()
      .checkSaveBtnDisabled()
      .toggleFonts()
      .toggleColor()
      .toggleBlockSpacing()
      .changeFont(font)
      .changeColor(primaryColor, secondaryColor)
      .changeBlockSpacing(blockSpacing)
      .checkFontPreview(font)
      .checkColorPreview(primaryColor)
      .checkBlockSpacingPreview(blockSpacingMargin)
      .checkSaveBtnEnabled()
      .save()

    cy.wait('@setConfiguration')
    siteSettings.checkSaveBtnDisabled()
    editor.toggleSiteSettings();
    siteSettings.checkDrawerNotVisible()
  });
});