import { PageObject } from "./PageObject";

export class CategoryPageObject extends PageObject {
  get categoryFilter() {
    return cy.getByTestId('category-filter-0');
  }

  filterClickShouldReloadCategory = () => {
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    
    this.categoryFilter.first().click();
    cy.wait('@getFacet').its('response.statusCode').should('eq', 200)
  }
}
