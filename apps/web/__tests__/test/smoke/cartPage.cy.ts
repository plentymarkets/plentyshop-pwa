import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { paths } from '../../../utils/paths';

const cart: CartPageObject = new CartPageObject();

describe('Smoke: Cart Page', () => {
  it('[smoke] Add coupon to cart, check the totals, then remove coupon and check totals again', () => {
    cy.visitAndHydrate('/study-room-office/office-chair/design-chair-brookhaven-leather-black_105_1003');
    cy.intercept('/plentysystems/doAddCartItem').as('doAddCartItem');
    cy.wait(1000);
    cy.getByTestId('add-to-cart').click();
    cy.wait('@doAddCartItem');
    cy.visitAndHydrate(paths.cart);
    cart.openCouponAccordion();
    cart.addCoupon('KB82AZ');
    cart.orderSummayAfterCouponApplyed('-£12.91', '£119.99');
    cart.removeCoupon();
    cart.orderSummayAfterCouponRemoved('£132.90');
  });
});
