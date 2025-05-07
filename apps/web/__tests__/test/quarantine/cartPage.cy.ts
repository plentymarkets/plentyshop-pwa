import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { paths } from '../../../utils/paths';

const cart = new CartPageObject();

before(() => {
  cy.intercept('/plentysystems/doAddCartItem').as('doAddCartItem');
  cy.clearCookies();
  cy.setCookie(
    'consent-cookie',
    '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}',
  );

  cy.visitAndHydrate(paths.home);
});

describe('Smoke: Cart Page', () => {
  it('[smoke] Add coupon to cart, check the totals, then remove coupon and check totals again', () => {
    cy.visitAndHydrate('/study-room-office/office-chair/design-chair-brookhaven-leather-black_105_1003');

    cy.wait(1000)
      .getByTestId('add-to-cart')
      .click()
      .wait('@doAddCartItem')
      .wait(1000)
      .getByTestId('quick-checkout-close')
      .click()
      .wait(1000);

    cart
      .openCart()
      .hasOrderSummary()
      .openCouponAccordion()
      .addCoupon('Z23ZMP')
      .orderSummaryAfterCouponApplied()
      .removeCoupon()
      .orderSummaryAfterCouponRemoved();
  });
});
