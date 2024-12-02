import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import newContent from '../../fixtures/newContent.json';

describe('EditMode', () => {
  const editor = new EditorObject();

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
  });

  it('should display the UiToolbar and interact with buttons when isPreview is true', () => {
    // Ensure the toolbar is visible
    editor.assertEditModeToolbarVisible();

    // Ensure the edit preview button is enabled and visible before clicking

    // Test to toggle preview mode and back
    editor.togglePreviewMode();
    editor.toggleEditMode();

    // Test to check the actions block
    editor.toggleEditMode();
    editor.assertEditBlockActionsVisible();
    editor.toggleEditMode();
    editor.assertEditBlockActionsNotVisible();

    // Ensure the open editor button is enabled and visible before clicking
    editor.openEditorButton.should('be.visible').and('not.be.disabled').click();

    // Test to open the editor and change the content
    editor.editorTextarea.should('be.visible').clear().type(JSON.stringify(newContent, null, 2));
    editor.editorTextarea.should('have.value', JSON.stringify(newContent, null, 2));
  });
});