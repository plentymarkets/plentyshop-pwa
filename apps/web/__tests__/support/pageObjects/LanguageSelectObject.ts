import { PageObject } from './PageObject';

export class LanguageSelectObject extends PageObject {
  checkOptions() {
    cy.getByTestId('languageOption-en').should('be.visible');
    cy.getByTestId('languageOption-de').should('be.visible');
    // for consistency should also check for flags svg present
    return this;
  }

  openModal() {
    cy.getByTestId('open-languageselect-button').first().click();
    cy.getByTestId('languageSelectList').first().should('be.visible');
    return this;
  }

  checkLanguageSelected(locale: string) {
    cy.getCookie('vsf-locale').should('have.property', 'value', locale);

    return this;
  }

  selectOption(option: string) {
    cy.getByTestId(`languageOption-${option}`).first().click();
    return this;
  }

  changeLanguage(option: string) {
    this.checkOptions().selectOption(option).checkLanguageSelected(option);

    return this;
  }

  checkUrl(url: string) {
    cy.url().should('include', url);
    return this;
  }
}
