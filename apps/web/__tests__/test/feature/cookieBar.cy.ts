import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';

const cookieBar = new CookieBarObject();
beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');

  cy.visitAndHydrate(paths.home);
});

describe('CookieBar functionality check.', () => {
  it('Checks external script.', () => {
    cookieBar.acceptAll().checkExternalScript();

    cy.window().then((win) => {
      cy.spy(win.console, 'warn').as('consoleWarn')
    })

    cy.wait(5000)

    cy.get('@consoleWarn').should('not.have.been.called')
  });
});
