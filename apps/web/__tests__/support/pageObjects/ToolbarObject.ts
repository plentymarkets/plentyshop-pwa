import { PageObject } from './PageObject';

export class ToolbarObject extends PageObject {
  get saveButton() {
    return cy.getByTestId('edit-save-button');
  }

  assertSaveEnabled() {
    this.saveButton.should('be.visible').and('be.enabled');
    return this;
  }

  assertSaveDisabled() {
    this.saveButton.should('be.visible').and('be.disabled');
    return this;
  }

  clickSave() {
    this.saveButton.click();
    return this;
  }
}
