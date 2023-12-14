import { CartPageObject } from '../../support/pageObjects/CartPageObject';

const cart: CartPageObject = new CartPageObject();

describe('Smoke: Cart Page', () => {
  it('[smoke] Add coupon to cart, check the totals, then remove coupon and check totals again', { retries: 3 }, () => {
    cy.visitAndHydrate('/study-room-office/office-chair/design-chair-brookhaven-leather-black_105_1003');

    cy.wait(1000)
      .intercept('/plentysystems/doAddCartItem')
      .as('doAddCartItem')
      .wait(1000)
      .getByTestId('add-to-cart')
      .click()
      .wait('@doAddCartItem');

    cart
      .openCart()
      .openCouponAccordion()
      .addCoupon('KB82AZ')
      .orderSummayAfterCouponApplyed()
      .removeCoupon()
      .orderSummayAfterCouponRemoved();
  });
});
