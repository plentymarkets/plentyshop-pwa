import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
// import newContent from '../../fixtures/newContent.json';

describe.skip('EditMode', () => {
  const editor = new EditorObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should display and interact with the editor textarea', () => {
    editor.isToolbarVisible();
    editor.toggleEditMode();
    editor.togglePreviewMode();
    // editor.checkEditorContent();
    // editor.replaceEditorContent(JSON.stringify(newContent, null, 2));
    // editor.checkEditorChanges();
  });

  it('should switch language and check editor content', () => {
    editor.switchLanguage();
  });
});
