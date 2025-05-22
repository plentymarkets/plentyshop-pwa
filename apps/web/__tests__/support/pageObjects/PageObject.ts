export class PageObject {
  waitFor(intercepts: string[]) {
    cy.wait(intercepts, { timeout: 2000 });
    return this;
  }
}
