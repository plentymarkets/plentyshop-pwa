/* eslint-disable @typescript-eslint/no-unused-expressions */
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

  assertProductStructuredDataExists() {
    cy.get('script[type="application/ld+json"]').should((scripts) => {
      const hasProductData = [...scripts].some((script) => {
        try {
          const data = JSON.parse(script.innerHTML) as Record<string, unknown>;
          return data['@type'] === 'Product' && data['@context'] === 'https://schema.org';
        } catch {
          return false;
        }
      });
      expect(hasProductData, 'Product JSON-LD structured data should be present').to.be.true;
    });
    return this;
  }

  assertStructuredData() {
    cy.get('script[type="application/ld+json"]').should((scripts) => {
      const jsonLdItems: Record<string, unknown>[] = [];

      [...scripts].forEach((script) => {
        try {
          jsonLdItems.push(JSON.parse(script.innerHTML) as Record<string, unknown>);
        } catch {
          // ignore malformed scripts
        }
      });

      const productData = jsonLdItems.find((item) => item['@type'] === 'Product');

      expect(productData, 'Product structured data should be present').to.not.be.undefined;

      // Top-level schema fields
      expect(productData).to.have.property('@context', 'https://schema.org');
      expect(productData).to.have.property('@type', 'Product');
      expect(productData).to.have.property('name').and.be.a('string').and.not.be.empty;
      expect(productData).to.have.property('image').and.be.a('string').and.not.be.empty;
      expect(productData).to.have.property('identifier').and.be.a('string');
      expect(productData).to.have.property('description').and.be.a('string');
      expect(productData).to.have.property('disambiguatingDescription').and.be.a('string');
      expect(productData).to.have.property('category').and.be.a('string');
      expect(productData).to.have.property('sku').and.be.a('string');

      // Reviews array
      expect(productData).to.have.property('review').and.be.an('array');
      const reviews = (productData?.['review'] ?? []) as Record<string, unknown>[];
      reviews.forEach((review) => {
        expect(review).to.have.property('@type', 'Review');
        expect(review).to.have.nested.property('reviewRating.@type', 'Rating');
        expect(review).to.have.nested.property('reviewRating.ratingValue').and.be.a('number');
        expect(review).to.have.nested.property('author.@type', 'Person');
        expect(review).to.have.nested.property('author.name').and.be.a('string');
      });

      // Aggregate rating
      expect(productData).to.have.nested.property('aggregateRating.@type', 'AggregateRating');
      expect(productData).to.have.nested.property('aggregateRating.ratingValue').and.be.a('number');
      expect(productData).to.have.nested.property('aggregateRating.reviewCount').and.be.a('number');

      // Offers
      expect(productData).to.have.nested.property('offers.@type', 'Offer');
      expect(productData).to.have.nested.property('offers.price').and.be.a('number');
      expect(productData).to.have.nested.property('offers.priceCurrency').and.be.a('string').and.not.be.empty;
      expect(productData).to.have.nested.property('offers.itemCondition').and.be.a('string');

      const offers = (productData?.['offers'] ?? {}) as Record<string, unknown>;
      expect(offers).to.have.property('priceSpecification').and.be.an('array').and.have.length.gte(1);
      const priceSpecs = (offers['priceSpecification'] ?? []) as Record<string, unknown>[];
      priceSpecs.forEach((spec) => {
        expect(spec).to.have.property('@type', 'UnitPriceSpecification');
        expect(spec).to.have.property('price').and.be.a('number');
        expect(spec).to.have.property('priceCurrency').and.be.a('string').and.not.be.empty;
        expect(spec).to.have.property('priceType').and.be.a('string').and.not.be.empty;
        expect(spec).to.have.nested.property('referenceQuantity.@type', 'QuantitativeValue');
      });

      // Physical dimensions
      ['depth', 'width', 'height', 'weight'].forEach((dimension) => {
        expect(productData).to.have.nested.property(`${dimension}.@type`, 'QuantitativeValue');
        expect(productData).to.have.nested.property(`${dimension}.value`).and.be.a('number');
      });
    });
    return this;
  }

  addToCart(quantity: number) {
    cy.intercept('plentysystems/doAddCartItem').as('addToCart');

    this.quantitySelector.clear().type(quantity.toString());
    this.addToCartButton.click();

    cy.wait('@addToCart').its('response.statusCode').should('eq', 200);
  }
}
