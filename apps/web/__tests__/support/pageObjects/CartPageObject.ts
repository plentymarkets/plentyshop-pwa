import { PageObject } from './PageObject';

export class CartPageObject extends PageObject {
  get surchargeOfOrderProperty() {
    return cy.getByTestId('order-property-surcharge');
  }
  get cartItemFullPrice() {
    return cy.getByTestId('product-full-price');
  }
  get cartItemPrice() {
    return cy.getByTestId('cart-item-price');
  }
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

  compareItemAndFullPriceNyQuantity(quantity: number) {
    this.cartItemPrice.invoke('text').then((itemPriceText: string) => {
      const itemPrice = parseFloat(itemPriceText.replace(/[^\d.-]/g, ''));

      this.cartItemFullPrice.invoke('text').then((fullPriceText: string) => {
        const fullPrice = parseFloat(fullPriceText.replace(/[^\d.-]/g, ''));

        const expectedFullPrice = itemPrice * quantity;

        expect(fullPrice).to.be.closeTo(expectedFullPrice, 0.01);
      });
    });
    return this;
  }

  checkSurcharge(expectedSurcharge: string) {
    this.surchargeOfOrderProperty.should('contain.text', expectedSurcharge);
    return this;
  }

  checkCart() {
    cy.getFixture('products').then(() => {
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
    cy.getByTestId('subtotal-label').should('be.visible');
    cy.getByTestId('subtotal').should('be.visible');
    cy.getByTestId('shipping-label').should('be.visible');
    cy.getByTestId('shipping').should('be.visible');
    cy.getByTestId('vat-label').should('be.visible');
    cy.getByTestId('vat').should('be.visible');
    cy.getByTestId('total-label').should('be.visible');
    cy.getByTestId('total').invoke('text').should('have.length.gt', 0);
    return this;
  }

  increaseCartItemQuantity() {
    cy.getByTestId('quantity-selector-increase-button').click();
    return this;
  }

  decreaseCartItemQuantity() {
    cy.getByTestId('quantity-selector-decrease-button').click();
    return this;
  }

  summaryItems(expectedItems = 'Items: 2') {
    cy.getByTestId('total-in-cart').invoke('text').should('include', expectedItems);
    return this;
  }

  orderSummaryAfterCouponApplied() {
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
