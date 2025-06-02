import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';
import { EditorObject } from '../../support/pageObjects/EditorObject';
// import newContent from '../../fixtures/newContent.json';

describe('EditMode', () => {
  //   const editor = new EditorObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should open pages view and check list entries', () => {
    editor.checkContentPagesList();
    editor.contentPagesListContains('Homepage');
    editor.checkProductsPagesList();
    // editor.checkEditorChanges();
  });

// it('should open pages view and navigate correcly', () => {
//     editor.correctPagesNavigation();
//   });

//   it('should add a new page', () => {
//     editor.openPagesView();
//     editor.addNewPage();
    
//   });

//   it('should edit a page', () => {
//     editor.openPagesView();
//     editor.editPage();
//   });

//   it('should open pages view and interact with page settings', () => {
//     editor.selectAPageAndCheckForGear();
//     editor.openPageSettings();
//     editor.openGeneralSettings();
//     editor.checkGeneralSettings();
//     editor.openSeoSettings();
//     editor.checkSeoSettings();
//     editor.returnToGeneral();
//   });



});
