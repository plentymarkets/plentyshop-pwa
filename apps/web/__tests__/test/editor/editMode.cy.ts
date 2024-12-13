import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
import newContent from '../../fixtures/newContent.json';

describe('EditMode', () => {
  const editor = new EditorObject();

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
  });

  it('should display and interact with the editor textarea', () => {
    editor.isToolbarVisible();
    editor.toggleEditMode();
    editor.togglePreviewMode();
    editor.checkEditorContent();
    editor.replaceEditorContent(JSON.stringify(newContent, null, 2));
    editor.checkEditorChanges();
  });
});
