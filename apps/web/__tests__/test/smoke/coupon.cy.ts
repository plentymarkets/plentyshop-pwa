import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const cart = new CartPageObject();

describe('Smoke: Voucher test', () => {
  it('[smoke] Add voucher to cart and check order summary', () => {
    cy.visit(paths.home);
    cy.visitAndHydrate(paths.productWithCoupon);
    cy.getByTestId('add-to-cart').click();
    cart.openCart();
    cart.openVoucherAccordion();
    cart.addVoucher('KB82AZ');
    cart.orderSummayAfterVoucherApplyed();
  });

  it('[smoke] Remove voucher from cart and check order summary', () => {
    // Add voucher
    cy.visit(paths.home);
    cy.visitAndHydrate(paths.productWithCoupon);
    cy.getByTestId('add-to-cart').click();
    cart.openCart();
    cart.openVoucherAccordion();
    cart.addVoucher('KB82AZ');
    cart.orderSummayAfterVoucherApplyed();
    // Remove voucher
    cart.removeVoucher('KB82AZ');
    cart.orderSummayAfterVoucherRemoved();
  });

});
