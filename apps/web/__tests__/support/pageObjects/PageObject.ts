export class PageObject {
  waitFor(intercepts: string[]) {
    cy.wait(intercepts);
    return this;
  }
}
