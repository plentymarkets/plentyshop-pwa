import { NotifyMeObject } from '../../support/pageObjects/NotifyMeObject';
import { bypassValidation } from '../../support/bypassValidation';

const notifyMeObject = new NotifyMeObject();
const bypass = new bypassValidation();

describe('Smoke: Notify Me', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate('/gear/speaker-flamingo_158');
    bypass.byPassCLoudflareTurnstile();
  });

  it('[smoke] Open product page and successfully register on back in stock notifications', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    cy.intercept('POST', '**/plentysystems/doSubscribeNotifyMe', {
      statusCode: 200,
      body: { data: { success: true } },
    }).as('subscribeApi');

    notifyMeObject.openModal();
    notifyMeObject.fillAndSubmitModal(testEmail);

    cy.wait('@subscribeApi');

    notifyMeObject.checkModalClosed();
    cy.getByTestId('notifications').should('exist');
  });

  it('[smoke] Open product page and try to register with wrong email', () => {
    cy.intercept('POST', '**/plentysystems/doSubscribeNotifyMe').as('subscribeApi');

    notifyMeObject.openModal();
    const testEmail = `test-example.com`;
    notifyMeObject.fillAndSubmitModal(testEmail);

    notifyMeObject.checkModalOpen();
    cy.wait(500);
    cy.get('@subscribeApi.all').should('have.length', 0);
  });
});
