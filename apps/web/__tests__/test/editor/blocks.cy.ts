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

    it('should not be possible to move the first block up', () => {
      editor.checkFirstBlock();
    });

    it('should not be possible to move the last block down', () => {
      editor.checkLastBlock();
    });

    it('should move a block on the page', () => {
      editor.assertDefaultBlockOrder();
      editor.moveBlock();
      editor.assertChangedBlockOrder();
    });

    it('should check for recommended products', () => {
      editor.recommendedProductsExist();
    });
  });
