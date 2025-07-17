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

  selectOption(option: string) {
    cy.intercept('/plentysystems/getCart').as('getCart');
    cy.getByTestId(`languageOption-${option}`).first().click().wait('@getCart');
    return this;
  }

  changeLanguage(option: string) {
    this.checkOptions().selectOption(option);

    return this;
  }

  checkUrl(url: string) {
    cy.url().should('include', url);
    return this;
  }

  openMobileModal() {
    cy.getByTestId('open-languageselect-button').first().click();
    cy.getByTestId('modal').first().should('be.visible');
    return this;
  }

  checkLanguageFlags() {
    cy.getByTestId('flagIcon-en').should('be.visible');
    cy.getByTestId('flagIcon-de').should('be.visible');
    return this;
  }

  closeModal() {
    cy.getByTestId('overlay').first().click(0, 0);
    cy.getByTestId('modal').should('not.exist');
    return this;
  }
}
