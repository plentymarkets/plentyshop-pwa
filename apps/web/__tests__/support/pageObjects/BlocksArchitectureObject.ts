import { PageObject } from './PageObject';
import emptyBlocksResponse from '../../fixtures/blocks/emptyBlocksResponse.json';
import partialBlocksResponse from '../../fixtures/blocks/partialBlocksResponse.json';
import fullBlocksResponse from '../../fixtures/blocks/fullBlocksResponse.json';
import savedBlocksResponse from '../../fixtures/blocks/savedBlocksResponse.json';

interface BlocksFixture {
  data: Record<string, unknown>;
}

export class BlocksArchitectureObject extends PageObject {
  get headerContainer() {
    return cy.getByTestId('header-container');
  }

  get categoryButtons() {
    return cy.getByTestId('category-button');
  }

  get footerElement() {
    return this.footer;
  }

  get textCards() {
    return cy.getByTestId('text-card');
  }

  get bannerImages() {
    return cy.get('[data-testid^="banner-image-"]');
  }

  get imageBlock() {
    return cy.getByTestId('image-block');
  }

  get recommendedBlock() {
    return cy.getByTestId('recommended-block');
  }

  get newsletterBlock() {
    return cy.getByTestId('newsletter-block');
  }

  get simplifiedHeader() {
    return cy.getByTestId('navbar-top-desktop');
  }

  get categoryData() {
    return cy.getByTestId('category-data');
  }

  get categoryPageContent() {
    return cy.getByTestId('category-page-content');
  }

  get categorySortFilter() {
    return cy.getByTestId('category-sort-filter');
  }

  get categoryGrid() {
    return cy.getByTestId('category-grid');
  }

  get itemText() {
    return cy.getByTestId('item-text');
  }

  get technicalData() {
    return cy.getByTestId('technical-data');
  }

  get reviewArea() {
    return cy.getByTestId('review-area');
  }

  get legalInformation() {
    return cy.getByTestId('legal-information');
  }

  interceptBlocksWithFixture(fixture: BlocksFixture) {
    cy.intercept('/plentysystems/getBlocksWithGlobalBlocks', {
      statusCode: 200,
      body: fixture,
    }).as('getBlocks');
    return this;
  }

  interceptEmpty() {
    return this.interceptBlocksWithFixture(emptyBlocksResponse);
  }

  interceptPartial() {
    return this.interceptBlocksWithFixture(partialBlocksResponse);
  }

  interceptFull() {
    return this.interceptBlocksWithFixture(fullBlocksResponse);
  }

  interceptSave() {
    cy.intercept('/plentysystems/doSaveBlocksWithGlobalBlocks', {
      statusCode: 200,
      body: fullBlocksResponse,
    }).as('saveBlocks');
    return this;
  }

  interceptSaved() {
    return this.interceptBlocksWithFixture(savedBlocksResponse);
  }

  waitForBlocks() {
    cy.wait('@getBlocks');
    return this;
  }

  waitForSave() {
    cy.wait('@saveBlocks');
    return this;
  }

  assertHeaderContainerVisible() {
    this.headerContainer.should('be.visible');
    return this;
  }

  assertFooterVisible() {
    this.footerElement.scrollIntoView().should('be.visible');
    return this;
  }

  assertFooterHasDefaultColors() {
    this.footerElement.should('have.css', 'background-color', 'rgb(207, 228, 236)');
    return this;
  }

  assertFooterHasApiColors() {
    this.footerElement.should('have.css', 'background-color', 'rgb(26, 43, 60)');
    return this;
  }

  assertFooterContainsText(text: string) {
    this.footerElement.scrollIntoView().should('contain.text', text);
    return this;
  }

  assertApiTextBlockVisible() {
    cy.contains('API Text Block').should('exist');
    return this;
  }

  assertDefaultHomepageTemplate() {
    this.bannerImages.should('exist');
    this.textCards.should('exist');
    this.recommendedBlock.should('exist');
    this.multiGridStructure.should('exist');
    this.multiGridColumn.should('have.length', 2);
    this.imageBlock.should('exist');
    this.newsletterBlock.should('exist');
    return this;
  }

  assertDefaultCategoryTemplate() {
    this.categoryData.should('exist');
    this.multiGridStructure.should('exist');
    this.categorySortFilter.should('exist');
    this.categoryGrid.should('exist');
    return this;
  }

  assertDefaultProductTemplate() {
    this.multiGridStructure.should('exist');
    this.reviewArea.should('exist');
    this.legalInformation.should('exist');
    this.recommendedBlock.should('exist');
    return this;
  }

  assertSimplifiedHeaderVisible() {
    this.simplifiedHeader.should('be.visible');
    return this;
  }
}
