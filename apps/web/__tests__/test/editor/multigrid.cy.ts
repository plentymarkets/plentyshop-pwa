import { MultiGridObject } from '../../support/pageObjects/MultiGridObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

import { paths } from '../../../utils/paths';

describe('Multigrid test suite', () => {
  const multiGrid = new MultiGridObject();
  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should add a basic 6-6 multigrid block', () => {
    multiGrid.insertGridBlock();
    multiGrid.checkIfLayoutBlockWasAdded();
    multiGrid.checkIfGridHasSixColumns();
  });

  it('should edit 6-6 multigrid with correct blocks', () => {
    // editor.buttonsExistWithGroupClasses();

    // click first block plus button
    // open Layout accordion from the block list

    multiGrid.insertGridBlock();
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
