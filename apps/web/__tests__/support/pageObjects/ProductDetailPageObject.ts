import { PageObject } from './PageObject';

export class ProductDetailPageObject extends PageObject {
  get addToCartButton() {
    return cy.getByTestId('add-to-cart');
  }

  get productTitle() {
    return cy.getByTestId('product-name');
  }

  get productDescription() {
    return cy.getByTestId('product-description').eq(0);
  }

  get productGallery() {
    return cy.getByTestId('gallery-images');
  }

  get quantitySelector() {
    return cy.getByTestId('quantity-selector-input');
  }

  get productPriceValue() {
    return cy.getByTestId('price');
  }

  get productImage() {
    return cy.getByTestId('product-image-0');
  }

  get itemTextBlock() {
    return cy.getByTestId('item-text-block');
  }

  get technicalDataBlock() {
    return cy.getByTestId('technical-data-block');
  }

  get reviewArea() {
    return cy.getByTestId('review-area');
  }

  get legalInformation() {
    return cy.getByTestId('legal-information');
  }

  displayCheck() {
    this.assertProductDetailPageElements();
    return this;
  }

  assertProductDetailPageElements() {
    this.productTitle.should('be.visible');
    this.productGallery.should('be.visible');
    this.productPriceValue.should('be.visible');
    this.quantitySelector.should('be.visible');
    this.addToCartButton.should('be.visible');
    return this;
  }

  assertBlockTemplate() {
    this.multiGridStructure.should('exist');
    this.itemTextBlock.should('exist');
    this.technicalDataBlock.should('exist');
    this.reviewArea.should('exist');
    this.legalInformation.should('exist');
    this.footer.should('have.length', 1);
    return this;
  }

  assertModernImageFormat() {
    this.productImage.should('have.attr', 'srcset').and('include', '.avif');
    return this;
  }

  addToCart(quantity: number) {
    cy.intercept('plentysystems/doAddCartItem').as('addToCart');

    this.quantitySelector.clear().type(quantity.toString());
    this.addToCartButton.click();

    cy.wait('@addToCart').its('response.statusCode').should('eq', 200);
  }
}
