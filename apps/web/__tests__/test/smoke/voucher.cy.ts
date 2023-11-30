import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { paths } from '../../../utils/paths';

const cart = new CartPageObject();

describe('Smoke: Voucher test', () => {
  beforeEach(() => {
    cy.setCookie('vsf-locale', 'en');
    cy.setCookie('consent-cookie', '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}')
  });
  
  it('[smoke] Add voucher to cart and check order summary then remove voucher and check order summary', () => {
    cy.visitAndHydrate('/study-room-office/office-chair/design-chair-brookhaven-leather-black_105_1003');
    cy.intercept('/plentysystems/doAddCartItem').as('doAddCartItem');
    cy.wait(1000);
    cy.getByTestId('add-to-cart').click();
    cy.wait('@doAddCartItem');
    cy.visitAndHydrate(paths.cart);
    cart.openVoucherAccordion();
    cart.addVoucher('KB82AZ');
    cart.orderSummayAfterVoucherApplyed('-£12.95','£119.99');
    cart.removeVoucher();
    cart.orderSummayAfterVoucherRemoved('£132.94');
  });
});
