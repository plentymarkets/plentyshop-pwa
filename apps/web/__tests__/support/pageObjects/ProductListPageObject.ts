import { PageObject } from './PageObject';

export class ProductListPageObject extends PageObject {
  get categoryGrid() {
    return cy.getByTestId('category-grid');
  }

  get productPrice() {
    return cy.getByTestId('product-card-vertical-price');
  }

  get products() {
    return cy.getByTestId('product-card');
  }

  get categories() {
    return cy.getByTestId('categories');
  }

  get categoryHeader() {
    return cy.getByTestId('category-layout').find('h1');
  }

  get productLink() {
    return cy.getByTestId('product-card-link').first();
  }

  get categoryData() {
    return cy.getByTestId('category-data');
  }

  get sortFilter() {
    return cy.getByTestId('category-sort-filter');
  }

  assertProductCardPath(expectedPathContent?: string) {
    const link = this.productLink;

    if (expectedPathContent) {
      link.should('have.attr', 'href').and('contain', expectedPathContent);
    } else {
      link.should('have.attr', 'href').and('not.be.empty');
    }

    return this;
  }

  assertProductListElements() {
    this.products.each((product) => {
      cy.wrap(product).as('product');
      cy.get('@product').find(`[data-testid="image-slot"]`).should('be.visible');
      cy.get('@product').find(`[data-testid="link"]`).should('be.visible');
      cy.get('@product').find(`[data-testid="product-card-vertical-price"]`).should('be.visible');
      cy.get('@product').find(`[data-testid="button"]`).should('be.visible');
    });
    return this;
  }

  assertFirstProduct() {
    this.products.first().then((product) => {
      cy.wrap(product).as('product');

      cy.get('@product')
        .find(`[data-testid="link"]`)
        .then(() => {
          cy.get('@product')
            .find(`[data-testid="product-card-vertical-price"]`)
            .then(() => {
              cy.get('@product').click();
            });
        });
    });
    return this;
  }

  assertBlockTemplate() {
    this.categoryData.should('exist');
    this.sortFilter.should('exist');
    this.categoryGrid.should('exist');
    this.footer.should('have.length', 1);
    return this;
  }

  assertGridView() {
    this.categoryGrid.should('be.visible');
    this.categoryGrid.find(`[data-testid="product-card"]`).should('be.visible');
    return this;
  }

  openFirstCategory() {
    this.categories.first().then((firstCategory) => {
      cy.wrap(firstCategory).as('category');
      cy.get('@category')
        .find(`[data-testid="list-item-menu-label"]`)
        .first()
        .then((el) => {
          cy.wrap(el).click();
          this.categoryHeader.should('have.text', 'All products');
        });
    });
    return this;
  }

  addToCart() {
    this.products.find(`[data-testid="add-to-basket-short"]`).first().click();
    cy.wait(1000);
    cy.getByTestId('quick-checkout-close').click();
    return this;
  }

  goToProduct() {
    cy.intercept('/plentysystems/getProduct').as('getProduct');
    cy.intercept('/plentysystems/getReview').as('getReview');
    this.products.first().click();
    cy.wait(['@getProduct', '@getReview']);
    return this;
  }

  assertPaginationLinkPage(rel: 'prev' | 'next', expectedPage: number | null) {
    cy.get(`head link[rel="${rel}"]`).should(($link) => {
      if (expectedPage === null) {
        expect($link, `expected no ${rel} link but found one`).to.have.length(0);
        return;
      }

      expect($link, `expected a ${rel} link but found none`).to.have.length(1);
      const href = $link.attr('href') as string;
      const page = new URL(href).searchParams.get('page');
      const actualPage = page ? Number(page) : 1;
      expect(actualPage, `${rel} link "${href}" should point to page ${expectedPage}`).to.eq(expectedPage);
    });
    return this;
  }

  goToNextPage() {
    cy.getByTestId('pagination-next').click();
    cy.wait('@getFacet');
    return this;
  }
}
