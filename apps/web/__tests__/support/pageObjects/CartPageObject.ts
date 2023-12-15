export class CartPageObject {
  get cartPreview() {
    return cy.getByTestId('checkout-layout');
  }

  get totalItemsAmount() {
    return cy.getByTestId('total-in-cart');
  }

  get subtotalPrice() {
    return cy.getByTestId('special-price');
  }

  get totalPrice() {
    return cy.getByTestId('total');
  }

  get promoCodeInput() {
    return cy.getByTestId('input-field');
  }

  get quanityDecreaseButton() {
    return cy.getByTestId('quantity-selector-decrease-button');
  }

  get productCards() {
    return cy.getByTestId('product-card');
  }

  get quantitySelectorInput() {
    return cy.getByTestId('quantity-selector-input');
  }

  get cartBadgeIndicator() {
    return cy.getByTestId('cart-action').getByTestId('cart-badge').getByTestId('badge-indicator');
  }

  get cartItem() {
    return cy.getByTestId('link');
  }

  get cartIcon() {
    return cy.getByTestId('navbar-top').find('[data-testid="shopping-cart"]');
  }

  checkCart() {
    cy.getFixture('products').then((fixture) => {
      this.assertCartPreviewElements();
    });
  }

  assertCartPreviewElements() {
    this.cartPreview.should('be.visible');
    this.totalPrice.should('be.visible');
    return this;
  }

  openCart() {
    this.cartIcon.click();
    return this;
  }

  openCouponAccordion() {
    cy.getByTestId('couponZone').click();
    return this;
  }

  addCoupon(couponCode: string) {
    cy.getByTestId('couponCode').find('[data-testid="input-field"]').type(couponCode);
    cy.getByTestId('couponAdd').click();
    return this;
  }

  removeCoupon() {
    cy.getByTestId('couponRemove').click();
    return this;
  }

  hasOrderSummary() {
    cy.getByTestId('subtotal-label').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('subtotal').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('shipping-label').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('shipping').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('vat-label').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('vat').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('total-label').invoke('text').should('have.length.gt', 0);
    cy.getByTestId('total').invoke('text').should('have.length.gt', 0);
    return this;
  }

  orderSummaryAfterCouponApplyed() {
    this.hasOrderSummary();
    cy.getByTestId('coupon-label').should('be.visible');
    cy.getByTestId('coupon-value').should('be.visible');
    return this;
  }

  orderSummaryAfterCouponRemoved() {
    this.hasOrderSummary();
    cy.getByTestId('coupon-label').should('not.exist');
    cy.getByTestId('coupon-value').should('not.exist');
  }
}
