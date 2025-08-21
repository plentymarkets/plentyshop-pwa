import { PageObject } from './PageObject';

export class MultiGridObject extends PageObject {

  get multiGridStructure() {
    return cy.get('[data-testid="multi-grid-structure"]', { timeout: 60000 });
  }

  insertGridBlock() {}

  checkIfLayoutBlockWasAdded() {}

  openDrawerOnColumnOne() {}

  checkIfGridHasSixColumns() {}

  checkIfCorrectComponentStateIsActive() {}

  checkIfDrawerOpened() {}

  openRichTextAccordion() {}

  addRichTextBlock() {}

  checkIfRichTextBlockWasAdded() {}

  openDrawerOnColumnTwo() {}

  // Repeat for column two
  checkIfCorrectComponentStateIsActiveColumnTwo() {}

  checkIfDrawerOpenedColumnTwo() {}

  openRichTextAccordionColumnTwo() {}

  addRichTextBlockColumnTwo() {}

  checkIfRichTextBlockWasAddedColumnTwo() {}

}
