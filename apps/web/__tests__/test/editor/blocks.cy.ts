import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';

describe('Blocks', () => {
  const editor = new EditorObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
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

  it('should not be possible to move the last non-footer block down', () => {
    editor.checkLastNonFooterBlock();
  });

  it('should not be possible to move or delete the footer block', () => {
    editor.checkFooterBlock();
  });

  it('should move a block on the page', () => {
    editor.assertDefaultBlockOrder();
    editor.moveBlock();
    editor.assertChangedBlockOrder();
  });

  it('should check for recommended products', () => {
    editor.recommendedProductsExist();
  });

  it('should ensure correct spacings', () => {
    editor.checkWrapperSpacings();
  });
});
