import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { paths } from '../../../utils/paths';

const languageSelect = new LanguageSelectObject();

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
  cy.clearCookies();
});

describe('Smoke: Language Selector', () => {

  it('Check if Language selector works', () => {
    languageSelect.openModal();
    languageSelect.checkIfModalIsOpen();
    languageSelect.checkOptions();
    languageSelect.selectOption('de');
    languageSelect.checkLanguageSelected('de');
  });

  it('Should change the category url after language switch', () => {
    cy.visitAndHydrate('/living-room');
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    cy.intercept('/plentysystems/getCategoryTree').as('getCategoryTree');

    languageSelect.openModal().checkIfModalIsOpen().selectOption('de');
    cy.wait(['@getFacet', '@getCategoryTree']);
    cy.url().should('include', '/de/wohnzimmer');
  });

  it.only('Should change the product url after language switch', () => {
    cy.visitAndHydrate('/living-room/armchair-stool/armchair-afterwork_122');
    cy.intercept('/plentysystems/getProduct').as('getProduct');
    cy.intercept('/plentysystems/getCategoryTree').as('getCategoryTree');

    languageSelect.openModal().checkIfModalIsOpen().selectOption('de');
    cy.wait(['@getProduct', '@getCategoryTree']);
    cy.url().should('include', '/de/wohnzimmer/sessel-hocker/sessel-afterwork_122');
  });
});
