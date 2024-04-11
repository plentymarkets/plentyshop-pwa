import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { paths } from '../../../utils/paths';

const languageSelect = new LanguageSelectObject();

beforeEach(() => {
  cy.intercept('/plentysystems/getCategoryTree').as('getCategoryTree');
  cy.intercept('/plentysystems/getFacet').as('getFacet');
  cy.intercept('/plentysystems/getProduct').as('getProduct');

  cy.clearCookies();
});

describe('Feature: Language Selector', () => {
  it('Should change the language from EN to DE', () => {
    cy.visitAndHydrate(paths.home);

    languageSelect.openModal().changeLanguage('de');
  });

  it('Should stay on the same category page', () => {
    cy.visitAndHydrate('/living-room');

    languageSelect
      .openModal()
      .changeLanguage('de')
      .waitFor(['@getCategoryTree', '@getFacet'])
      .checkUrl('/de/wohnzimmer');
  });

  it('Should stay on the same product page', () => {
    cy.visitAndHydrate('/living-room/armchair-stool/armchair-afterwork_122');

    languageSelect
      .openModal()
      .changeLanguage('de')
      .waitFor(['@getProduct', '@getCategoryTree'])
      .checkUrl('/de/wohnzimmer/sessel-hocker/sessel-afterwork_122');
  });
});
