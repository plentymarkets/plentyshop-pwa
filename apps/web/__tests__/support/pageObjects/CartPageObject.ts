import { Product } from '../types/types';

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

  openVoucherAccordion() {
    cy.getByTestId('voucherZone').click();
    return this;
  }
  addVoucher(voucherCode: string) {
    cy.getByTestId('voucherCode').focus().type(voucherCode);
    cy.getByTestId('voucherAdd').click();
    return this;
  }
  orderSummayAfterVoucherApplyed(discount: string, total: string) {
    cy.getByTestId('coupon-label').should('be.visible');
    cy.getByTestId('coupon-value').contains(discount);
    cy.getByTestId('total').contains(total);
  }
  removeVoucher() {
    cy.getByTestId('voucherRemove').click();
    return this;
  }
  orderSummayAfterVoucherRemoved(total: string) {
    cy.getByTestId('coupon-label').should('not.exist');
    cy.getByTestId('total').contains(total);
  }
}
