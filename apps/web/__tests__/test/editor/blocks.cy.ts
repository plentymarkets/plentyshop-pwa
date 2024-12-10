import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';

describe('Blocks', () => {
    const editor = new EditorObject();
  
    beforeEach(() => {
      cy.visitAndHydrate(paths.home);
    });
  
    it('should ensure correct block logic and template', () => {
        editor.buttonsExistOnHover();
        editor.deleteBlock();

        // Add a new block Top

        // Add a new block Bottom

        // Remove a block

    

    });
  });
  