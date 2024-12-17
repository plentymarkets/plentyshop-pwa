import { EditorObject } from '../../support/pageObjects/EditorObject';
import { paths } from '../../../utils/paths';

describe('Language', () => {
  const editor = new EditorObject();

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
  });

  it('should ensure that language picker is available', () => {
    editor.isEditorLanguagePickerVisible();
  });
});