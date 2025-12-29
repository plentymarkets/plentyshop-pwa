import { PageObject } from './PageObject';

export class ReadonlyCheckoutPageObject extends PageObject {
  get displaySuccessPages() {
    return cy.get('[data-testid="order-success-page"]', { timeout: 60000 });
  }
  placeOrderButton() {
    cy.intercept('/plentysystems/doPlaceOrder').as('doPlaceOrder');
    cy.intercept('/plentysystems/doCapturePayPalOrderV2').as('doCapturePayPalOrderV2');

    cy.getByTestId('place-paypal-order-button').should('exist').click();
    cy.wait('@doPlaceOrder');
    cy.wait('@doCapturePayPalOrderV2');

    return this;
  }

  waitUntilDataIsLoaded() {
    cy.intercept('/plentysystems/getSession').as('getSession');
    cy.intercept('/plentysystems/getPaymentProviders').as('getPaymentProviders');
    cy.intercept('/plentysystems/getPayPalOrder').as('getPayPalOrder');
    cy.intercept('/plentysystems/doHandlePayPalAddress').as('doHandlePayPalAddress');

    cy.wait(['@getSession', '@getPaymentProviders', '@getPayPalOrder', '@doHandlePayPalAddress'], { timeout: 30000 });

    return this;
  }

  get thankYouBanner() {
    return cy.getByTestId('success-header');
  }

  get orderPaymentStatus() {
    return cy.getByTestId('order-payment-status');
  }

  displaySuccessPage() {
    this.displaySuccessPages.should('be.visible');
    this.thankYouBanner.should('be.visible');
    return this;
  }

  displayFullyPaid() {
    this.orderPaymentStatus.contains('Paid');
    return this;
  }

  acceptTerms() {
    cy.getByTestId('checkout-terms-checkbox').check();

    return this;
  }
}
