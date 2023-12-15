import { CartPageObject } from '../../support/pageObjects/CartPageObject';

const cart = new CartPageObject();

describe('Smoke: Cart Page', () => {
  it('[smoke] Add coupon to cart, check the totals, then remove coupon and check totals again', () => {
    cy.visitAndHydrate('/study-room-office/office-chair/design-chair-brookhaven-leather-black_105_1003');

    cy.wait(1000)
      .intercept('/plentysystems/doAddCartItem')
      .as('doAddCartItem')
      .getByTestId('add-to-cart')
      .click()
      .wait('@doAddCartItem');

    cart
      .openCart()
      .hasOrderSummary()
      .openCouponAccordion()
      .addCoupon('KB82AZ')
      .orderSummaryAfterCouponApplyed()
      .removeCoupon()
      .orderSummaryAfterCouponRemoved();
  });
});
