import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';

describe('Soft login e2e', () => {
  const confirmationUrl = '/en/confirmation/26387/75GRLU7BX';
  const postalCode = '24651';

  const checkoutSupport = new CheckoutPageObject();

  it('logs in via confirmation link and accesses customer orders', () => {
    cy.visitAndHydrate(confirmationUrl);
    cy.get('#input-soft-login').first().clear().type(postalCode);
    cy.get('#submit-soft-login').click();
    checkoutSupport.displaySuccessPage();
  });
});
