import { PageObject } from './PageObject';

export class CategoryObject extends PageObject {
  get categoryFilter() {
    return cy.getByTestId('category-filter-0');
  }

  navigateFromHome() {
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    cy.getByTestId('category-button').first().click();
    cy.wait('@getFacet');
    cy.getByTestId('category-page-content').should('be.visible');
    return this;
  }

  filterClickShouldReloadCategory = () => {
    cy.intercept('/plentysystems/getFacet').as('getFacet');

    this.categoryFilter.first().click();
    cy.wait('@getFacet').its('response.statusCode').should('eq', 200);
  };
}
