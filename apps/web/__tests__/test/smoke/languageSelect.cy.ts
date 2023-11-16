import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { paths } from '../../../utils/paths';

const languageSelect = new LanguageSelectObject();

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
  cy.clearCookies();
});

describe('Smoke: Language Selector', () => {

  it('[smoke] Check if Language selector works', () => {
    languageSelect.openModal();
    languageSelect.checkIfModalIsOpen();
    languageSelect.checkOptions();
    languageSelect.selectOption('de');
    languageSelect.checkLanguageSelected('de');
  });
});
