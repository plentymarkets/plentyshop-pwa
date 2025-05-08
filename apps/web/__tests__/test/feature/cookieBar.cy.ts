import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';

const cookieBar = new CookieBarObject();
beforeEach(() => {
  cy.clearCookies();

  cy.visitAndHydrate(paths.home);
});

describe('CookieBar functionality check.', () => {
  it('Checks external script.', () => {
    cookieBar.acceptAll().checkExternalScript();
  });
});
