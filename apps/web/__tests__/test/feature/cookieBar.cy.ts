import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

const cookieBar = new CookieBarObject();
beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
});

describe('CookieBar functionality check.', () => {
  it('Checks external script.', () => {
    cookieBar.openBar().acceptAll().checkExternalScript();
  });
});
