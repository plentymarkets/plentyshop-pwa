import { PageObject } from './PageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

export class SearchObject extends PageObject {
  productListPage = new ProductListPageObject();

  get searchInput() {
    return cy.getByTestId('search-bar-input');
  }

  get searchResults() {
    return cy.getByTestId('search-results');
  }

  searchFor(product: string) {
    cy.intercept('plentysystems/getSearch').as('getSearch');

    this.searchInput.type(product).type('{enter}');

    cy.wait('@getSearch').its('response.statusCode').should('eq', 200);
    this.searchResults.should('be.visible');

    return this;
  }

  goToProduct() {
    this.productListPage.goToProduct();
    return this;
  }
}
