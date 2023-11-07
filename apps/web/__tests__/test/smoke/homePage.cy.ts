import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { paths } from '../../../utils/paths';

const homePage = new HomePageObject();
const locale_de = 'de';
const locale_en = 'en';
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
    homePage.checkLanguage(locale_de, text_de);
  });

  it('[smoke] Check if EN on SSR works ', () => {
    cy.visitAndHydrate(paths.home);
    homePage.checkLanguage(locale_en, text_en);
  });
});
