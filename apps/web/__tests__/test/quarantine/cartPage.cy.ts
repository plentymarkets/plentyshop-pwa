import { CartPageObject } from '../../support/pageObjects/CartPageObject';

const cart = new CartPageObject();

describe('Smoke: Cart Page', () => {
  beforeEach(() => {
    cy.intercept('/plentysystems/doAddCartItem').as('doAddCartItem');
    cy.clearCookies();

    cy.visitSmoke();
  });

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

  it('should add a product to the cart and then increase the quantity', () => {
    cy.addToCart();
    cart.openCart().increaseCartItemQuantity().summaryItems();
  });

  it('should add a product to the cart and then decrease the quantity', () => {
    cy.addToCart();
    cart.openCart().increaseCartItemQuantity().decreaseCartItemQuantity().summaryItems('Items: 1');
  });

  it('should add a product to the cart and increase the quantity 3 times', () => {
    cy.addToCart();
    cart.openCart().increaseCartItemQuantity();

    cy.wait(1000);

    cart.increaseCartItemQuantity().increaseCartItemQuantity().summaryItems('Items: 4');
  });

  it('should display product with surcharge order property correct', () => {
    const quantity = 2;
    const Expected_Surcharge = '21.56';
    cy.addToCart(1025, quantity, [
      {
        property: {
          id: 27,
          valueType: 'empty',
          value: 'true',
          names: {
            name: 'Order Properties - without markup/surcharge  With option "Preselected" and "Required"',
          },
        },
      },
    ]);

    cart.openCart().compareItemAndFullPriceNyQuantity(quantity).checkSurcharge(Expected_Surcharge);
  });
});
