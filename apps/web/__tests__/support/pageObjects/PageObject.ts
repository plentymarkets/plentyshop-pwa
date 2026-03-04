export class PageObject {
  waitFor(intercepts: string[]) {
    cy.wait(intercepts);
    return this;
  }

  delay(delay: number) {
    cy.wait(delay);
    return this;
  }
}
