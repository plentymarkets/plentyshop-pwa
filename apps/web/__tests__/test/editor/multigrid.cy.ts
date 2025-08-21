// import { MultiGridObject } from "~/__tests__/support/pageObjects/MultiGridObject";
import { MultiGridObject } from '../../support/pageObjects/MultiGridObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { EditorObject } from '../../support/pageObjects/EditorObject';

import { paths } from '../../../utils/paths';

describe('Multigrid test suite', () => {
  const multiGrid = new MultiGridObject();
  const cookieBar = new CookieBarObject();
  const editor = new EditorObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should add a basic 6-6 multigrid block', () => {
    // editor.buttonsExistWithGroupClasses();

    // click first block plus button
    // open Layout accordion from the block list

    multiGrid.insertGridBlock();
    multiGrid.checkIfLayoutBlockWasAdded();
    multiGrid.checkIfGridHasSixColumns();
  });

  it('should edit 6-6 multigrid with correct blocks', () => {
    // editor.buttonsExistWithGroupClasses();

    // click first block plus button
    // open Layout accordion from the block list

    multiGrid.insertGridBlock();
    multiGrid.checkIfLayoutBlockWasAdded();
    multiGrid.openDrawerOnColumnOne();
    multiGrid.checkIfCorrectComponentStateIsActive();
    multiGrid.checkIfDrawerOpened();
    multiGrid.openRichTextAccordion();
    multiGrid.addRichTextBlock();
    multiGrid.checkIfRichTextBlockWasAdded();
    multiGrid.openDrawerOnColumnTwo();
    multiGrid.checkIfCorrectComponentStateIsActive();
    multiGrid.checkIfDrawerOpened();
    multiGrid.openRichTextAccordion();
    multiGrid.addRichTextBlock();
    multiGrid.checkIfRichTextBlockWasAdded();
  });
});

