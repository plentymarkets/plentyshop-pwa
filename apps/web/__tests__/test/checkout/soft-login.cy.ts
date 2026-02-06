import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';

describe('Soft login e2e', () => {
  const confirmationUrl = '/en/confirmation/26387/75GRLU7BX';
  const email = 'soft-login-e2e@plentyone.com';
  const password = 'Pa$$w0rd!';

  const checkoutSupport = new CheckoutPageObject();

  it('logs in via confirmation link and accesses customer orders', () => {
    cy.visitAndHydrate(confirmationUrl);
    cy.get('input[type="email"], input[name="email"], #email').first().clear().type(email);
    cy.get('input[type="password"], input[name="password"], #password').first().clear().type(password);
    cy.getByTestId('login-submit').click();
    checkoutSupport.displaySuccessPage();
  });
});
