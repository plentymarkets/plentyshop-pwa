import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
// import newContent from '../../fixtures/newContent.json';

describe('EditMode', () => {
  const editor = new EditorObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.setCookie('vsf-locale', 'en');
    cy.setCookie(
      'consent-cookie',
      '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}',
    );
    cy.visitAndHydrate(paths.home);
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
