
export class CategoryPageObject {
  get filterClickShouldReloadCategory() {
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    cy.getByTestId('category-filter-0').first().click();
    cy.wait('@getFacet').its('response.statusCode').should('eq', 200)
    return this;
  }
}
