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
}
