import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';

describe('Blocks', () => {
    const editor = new EditorObject();

    beforeEach(() => {
      cy.visitAndHydrate(paths.home);
    });

    it('should ensure correct block logic and template', () => {
        editor.buttonsExistWithGroupClasses();
        editor.deleteBlock();
        editor.addBlockTop();
        editor.addBlockBottom();
    });

    it('should check for recommended products', () => {
      editor.recommendedProductsExist();
    });
  });
