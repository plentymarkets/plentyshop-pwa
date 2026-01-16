import { NotifyMeObject } from '../../support/pageObjects/NotifyMeObject';
import { BypassValidation } from '../../support/bypassValidation';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { paths } from '../../../app/utils/paths';

const notifyMeObject = new NotifyMeObject();
const bypass = new BypassValidation();
const myAccount = new MyAccountPageObject();

describe('Smoke: Notify Me', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visitAndHydrate('/gear/speaker-flamingo_158');
    bypass.bypassCloudflareTurnstile();
  });

  it('[smoke] Open product page and successfully register on back in stock notifications', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    cy.intercept('POST', '**/plentysystems/doSubscribeNotifyMe', {
      statusCode: 200,
      body: { data: { success: true } },
    }).as('subscribeNotifyMe');

    notifyMeObject.openModal();
    notifyMeObject.fillAndSubmitModal(testEmail);

    cy.wait('@subscribeNotifyMe');

    notifyMeObject.checkModalClosed();
    cy.getByTestId('notifications').should('exist');
  });

  it('[smoke] Should prevent submission with invalid email due to HTML5 validation', () => {
    notifyMeObject.openModal();

    notifyMeObject.notifyMeEmailInput.clear().type('test-example.com');
    notifyMeObject.notifyMePrivacyCheckbox.check();

    notifyMeObject.notifyMeEmailInput.invoke('prop', 'validity').its('valid').should('be.false');

    notifyMeObject.notifyMeSubmitButton.click();

    notifyMeObject.checkModalOpen();
  });

  it('[smoke] Open the notify me modal and close using the close button', () => {
    notifyMeObject.openModal();
    notifyMeObject.notifyMeCloseButton.should('be.visible').click();
    notifyMeObject.checkModalClosed();
  });

  it('[smoke] Open the notify me modal with logged in user and check for prefilled email', () => {
    cy.intercept('/plentysystems/doLogin').as('doLogin');
    cy.visitAndHydrate(paths.authLogin);
    myAccount.successLogin();
    cy.wait('@doLogin').visitAndHydrate(paths.home);
    cy.visitAndHydrate('/gear/speaker-flamingo_158');

    notifyMeObject.openModal();
    cy.fixture('account').then((account) => {
      notifyMeObject.notifyMeEmailInput.should('have.value', account.email);
    });
  });
});
