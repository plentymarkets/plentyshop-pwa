import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { BlocksArchitectureObject } from '../../support/pageObjects/BlocksArchitectureObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';

const homePage = new HomePageObject();
const blocks = new BlocksArchitectureObject();
const checkout = new CheckoutPageObject();
const cookieBar = new CookieBarObject();
const text_de = 'Wohnzimmer';
const text_en = 'Living Room';

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
  cy.clearCookies();
});

describe('Smoke: Homepage', () => {
  it('[smoke] Check if Category button exists ', () => {
    homePage.checkHeaderCategory();
  });

  it('[smoke] Check if DE on SSR works ', () => {
    cy.visitAndHydrate(paths.home + '/de');
    homePage.checkLanguage(text_de);
  });

  it('[smoke] Check if EN on SSR works ', () => {
    cy.visitAndHydrate(paths.home);
    homePage.checkLanguage(text_en);
  });

  it('[smoke] Editor elements should not exist in live mode', () => {
    homePage.topToolbarShouldNotExist();
    homePage.sideToolbarShouldNotExist();
    homePage.blockActionsShouldNotExist();
  });

  it('[smoke] checkout shows simplified header and footer', () => {
    cookieBar.acceptAll();
    checkout.visit();

    // prettier-ignore
    blocks
      .assertSimplifiedHeaderVisible()
      .assertFooterVisible();
  });
});
