import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { paths } from '../../../utils/paths';

const homePage = new HomePageObject();
const cookieName = 'vsf-locale';
const locale_de = 'de';
const locale_en = 'en';

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
});

describe('Smoke: Homepage', () => {

  it('[smoke] Check if Category button exists ', () => {
    homePage.checkHeaderCategory();
  });

  it('[smoke] Check if DE on SSR works ', () => {
    cy.setCookie(cookieName, locale_de);
    cy.setCookie('i18n_redirected', locale_de);
    cy.visitAndHydrate(paths.home);
    homePage.checkLanguage(locale_de);
  });

  it('[smoke] Check if EN on SSR works ', () => {
    cy.setCookie(cookieName, locale_en);
    cy.setCookie('i18n_redirected', locale_en);
    cy.visitAndHydrate(paths.home);
    homePage.checkLanguage(locale_en);
  });
});
