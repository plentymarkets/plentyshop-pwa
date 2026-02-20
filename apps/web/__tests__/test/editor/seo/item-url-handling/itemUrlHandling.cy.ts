import { CookieBarObject } from '../../../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../../../support/pageObjects/EditorObject';
import { SeoSettingsObject } from '../../../../support/pageObjects/SeoSettingsObject';

describe('ItemUrlHandling', () => {
  const editor = new EditorObject();
  const seoSettings = new SeoSettingsObject();
  const cookieBar = new CookieBarObject();

  const seoEditorInit = () => {
    editor.isToolbarVisible();
    editor.toggleSeoSettings();
    editor.seoSettingsButton.trigger('mouseout', { force: true }).trigger('mouseleave', { force: true });
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/');
    cy.setConfig({enableCallistoUrlScheme: true})
    cookieBar.delay(500).acceptAll();
  });

  it('should check sidebar opens when user clicks on icon for SEO', () => {
    seoEditorInit();

    seoSettings.checkDrawerVisible().delay(500).closeDrawer();
    seoSettings.checkDrawerNotVisible();
  });

  it('should open the item URL Handling section', () => {
    seoEditorInit();

    seoSettings
      .checkDrawerVisible()
      .delay(500)
      .selectItemUrlHandlingSection()
      .toggleItemUrlHandlingSection()
      .goBackSection()
      .closeDrawer();
    seoSettings.checkDrawerNotVisible();
  });

  it('should toggle between Modern and Legacy options', () => {
    seoEditorInit();

    seoSettings
      .checkDrawerVisible()
      .delay(500)
      .selectItemUrlHandlingSection()
      .delay(500)
      .toggleItemUrlHandlingSection();

    seoSettings.checkLegacyButton().checkModernButton();
  });
});
