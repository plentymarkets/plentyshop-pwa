import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { paths } from '../../../utils/paths';

const languageSelect = new LanguageSelectObject();
const locale_de = 'de';
const locale_en = 'en';
const text_de = 'Wohnzimmer';
const text_en = 'Living Room';

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
  cy.clearCookies();
});

describe('Smoke: Language Selector', () => {

  it('[smoke] Check if Language selector works', () => {
    languageSelect.openModal();
    languageSelect.checkIfModalIsOpen();
    languageSelect.checkOptions();
  });
});
