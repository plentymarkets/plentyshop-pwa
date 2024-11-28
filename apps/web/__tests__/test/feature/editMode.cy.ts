import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import newContent from '../../fixtures/newContent.json';

describe('EditMode', () => {
  const editor = new EditorObject();
  // Function to get the value of a cookie using Cypress commands
  const getCookieValue = (name: string) => {
    return cy.getCookie(name).then((cookie) => {
      return cookie ? cookie.value : null;
    });
  };

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
  });

  it('should check if the pwa cookie exists and run tests accordingly', () => {
    getCookieValue('pwa').then((pwaCookie) => {
      if (pwaCookie) {
        // Test to toggle preview mode and back
        editor.assertEditModeToolbarVisible();
        editor.toggleEditMode();
        editor.editPreviewButton.should('contain.text', 'Edit');
        editor.toggleEditMode();
        editor.editPreviewButton.should('contain.text', 'Preview');

        // Test to check the actions block
        editor.toggleEditMode();
        editor.assertEditBlockActionsVisible();
        editor.toggleEditMode();
        editor.assertEditBlockActionsNotVisible();

        // Test to open the editor and change the content
        editor.openEditor();
        editor.clearAndTypeInEditor(JSON.stringify(newContent, null, 2));
        editor.assertEditorContent(JSON.stringify(newContent, null, 2));
      } else {
        cy.log('Skipping tests because the pwa cookie does not exist');
      }
    });
  });
});