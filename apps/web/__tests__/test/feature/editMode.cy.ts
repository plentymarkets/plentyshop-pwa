import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import newContent from '../../fixtures/newContent.json';

describe('EditMode', () => {
  const editor = new EditorObject();

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
  });

  it('should display and interact with the editor textarea', () => {
    editor.isToolbarVisible(); // Ensure toolbar is visible
    editor.togglePreviewMode(); // Toggle to preview mode
    editor.toggleEditMode(); // Toggle back to edit mode
    editor.isEditBlockVisible(); // Check if edit block is visible
    editor.checkEditorContent(); // Use the updated method to check editor content

    // Additional assertions if needed
    editor.replaceEditorContent(JSON.stringify(newContent, null, 2));
  });
});