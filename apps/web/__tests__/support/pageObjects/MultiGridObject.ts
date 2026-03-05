import { PageObject } from './PageObject';

export class MultiGridObject extends PageObject {
  get multiGridStructure() {
    return cy.get('[data-testid="multi-grid-structure"]');
  }

  get blocksAccordionImage() {
    return cy.get('[data-testid*="block-category-layout"]');
  }

  get blockWrappers() {
    return cy.get('[data-testid*="block-wrapper"]');
  }

  get topBlockButton() {
    return cy.getByTestId('top-add-block');
  }

  get addBlockButton() {
    return cy.getByTestId('block-add-layout-0');
  }

  get blockWrapper() {
    return cy.get('[data-testid*="block-wrapper"]');
  }

  get firstBlock() {
    return cy.get('#block-0');
  }

  insertGridBlock() {
    this.blockWrappers.then((initialBlocks) => {
      const initialLength = initialBlocks.length;
      this.topBlockButton.invoke('removeClass', 'opacity-0');
      this.topBlockButton.first().should('exist').click();
      cy.wait(1000);
      this.blocksAccordionImage.should('exist').click();
      cy.wait(1000);
      this.addBlockButton.should('exist').click();
      cy.wait(1000);
      this.blockWrappers.should('have.length', initialLength + 1);
    });
  }

  checkIfLayoutBlockWasAdded() {
    this.firstBlock.find('[data-testid="multi-grid-structure"]').should('exist');
  }

  checkIfGridHasSixColumns() {
    this.multiGridStructure.find('div.col-6').should('have.length', 2);
  }

  openDrawerOnColumnOne() {}

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

