export class PageObject {
  get footer() {
    return cy.getByTestId('footer');
  }

  get multiGridStructure() {
    return cy.getByTestId('multi-grid-structure');
  }

  get multiGridColumn() {
    return cy.getByTestId('multi-grid-column');
  }

  waitFor(intercepts: string[]) {
    cy.wait(intercepts);
    return this;
  }

  delay(delay: number) {
    cy.wait(delay);
    return this;
  }
}
