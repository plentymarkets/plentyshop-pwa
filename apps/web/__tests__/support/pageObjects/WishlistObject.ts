import { PageObject } from './PageObject';

export class WishlistObject extends PageObject {
  get wishlistIcon() {
    return cy.getByTestId('navbar-top').find('[data-testid="wishlist-page-navigation"]');
  }

  get wishlistPage() {
    return cy.getByTestId('wishlist-page-content');
  }

  get wishlistProduct() {
    return this.wishlistPage.getByTestId('product-card');
  }

  get addToCartTrigger() {
    return this.wishlistProduct.getByTestId('add-to-basket-short');
  }

  get wishlistTrigger() {
    return cy.getByTestId('wishlist-trigger');
  }

  openWishlist() {
    this.wishlistIcon.click();
    cy.wait('@getWishlist');
    return this;
  }

  addWishlistItem() {
    this.wishlistTrigger.first().click();
    cy.wait('@doAddWishlistItem');
    return this;
  }

  removeWishlistItem() {
    this.wishlistTrigger.first().click();
    cy.wait('@deleteWishlistItem');
    return this;
  }

  checkItemExistence() {
    this.wishlistProduct.should('be.visible');
    return this;
  }

  addToCart() {
    this.addToCartTrigger.first().click();
    cy.wait(1000);
    cy.getByTestId('quick-checkout-close').click();
    return this;
  }

  checkEmptyPage() {
    this.wishlistPage.getByTestId('empty-wishlist-text').should('be.visible');
    return this;
  }
}
