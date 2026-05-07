export class PageObject {
  get footer() {
    return cy.getByTestId('footer');
  }

  get multiGridStructure() {
    return cy
      .get('[data-testid="multi-grid-structure"]')
      .not('[data-testid="footer"] [data-testid="multi-grid-structure"]');
  }

  get multiGridColumn() {
    return cy.get('[data-testid="multi-grid-column"]').not('[data-testid="footer"] [data-testid="multi-grid-column"]');
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
