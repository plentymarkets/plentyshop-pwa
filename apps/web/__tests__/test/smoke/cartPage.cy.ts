import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { paths } from '../../../utils/paths';

const cart: CartPageObject = new CartPageObject();

describe('Smoke: Cart Page', () => {
  it('[smoke] Add coupon to cart, check the totals, then remove coupon and check totals again', { retries: 3 }, () => {
    cy.visitAndHydrate('/study-room-office/office-chair/design-chair-brookhaven-leather-black_105_1003');

    cy.intercept('/plentysystems/doAddCartItem')
      .as('doAddCartItem')
      .getByTestId('add-to-cart')
      .click()
      .wait('@doAddCartItem')
      .visitAndHydrate(paths.cart);

    cart
      .openCouponAccordion()
      .addCoupon('KB82AZ')
      .orderSummayAfterCouponApplyed('-£12.91', '£119.99')
      .removeCoupon()
      .orderSummayAfterCouponRemoved('£132.90');
  });
});
