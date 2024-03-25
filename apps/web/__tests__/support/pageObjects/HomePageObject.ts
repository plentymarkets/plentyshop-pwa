import { PageObject } from "./PageObject";

export class HomePageObject extends PageObject {
  get header() {
    return cy.getByTestId('header');
  }

  get primaryButton() {
    return cy.getByTestId('button').contains('Order now');
  }

  get secondaryButton() {
    return cy.getByTestId('button').contains('Show more');
  }

  get categoryCard() {
    return cy.getByTestId('render-content');
  }

  get banners() {
    return cy.getByTestId('display');
  }

  get productCard() {
    return cy.getByTestId('product-card');
  }

  get headerButton() {
    return cy.getByTestId('button').contains('Browse products');
  }

  get baseUrl() {
    return Cypress.config('baseUrl');
  }

  assertHeader(): void {
    this.header.should('be.visible');
  }

  checkPrimaryButton() {
    this.primaryButton.should('have.text', 'Order now').click();
    cy.url().should('eq', `${this.baseUrl}/product/athletic-mens-walking-sneakers`);
    return this;
  }

  checkSecondaryButton() {
    this.secondaryButton.should('have.text', 'Show more').click();
    cy.url().should('eq', `${this.baseUrl}/category`);
    return this;
  }

  checkCategoryCard() {
    this.categoryCard.should('be.visible');
    return this;
  }

  checkBanners() {
    this.banners.should('be.visible');
    return this;
  }

  checkProductCard() {
    this.productCard.should('be.visible');
    return this;
  }

  checkLanguage(locale: string, textToCheck: string) {
    const categories = cy.getByTestId('category-button');
    categories.invoke('text').should('include', textToCheck);
    cy.getCookie('vsf-locale').should('have.property', 'value', locale);

    return this;
  }

  checkHeaderCategory() {
    cy.getByTestId('category-button').first().should('be.visible');
    return this;
  }

  goToCategory() {
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    cy.getByTestId('category-button').first().click();
    cy.wait('@getFacet');
    return this;
  }
}
