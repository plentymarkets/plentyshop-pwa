export class LanguageSelectObject {
  checkIfModalIsOpen() {
    cy.getByTestId('languageSelectList').first().should('be.visible');
    return this;
  }

  checkOptions() {
    cy.getByTestId('languageOption-en').should('be.visible');
    cy.getByTestId('languageOption-de').should('be.visible');
    // for consistency should also check for flags svg present
    return this;
  }

  openModal() {
    cy.getByTestId('open-languageselect-button').first().click();;
    return this;
  }

  checkLanguageSelected(locale: string) {
    cy.getCookie('vsf-locale').should('have.property', 'value', locale);

    return this;
  }

  selectOption(option: string) {
    cy.getByTestId(`languageOption-${option}`).first().click();;
    return this;
  }
}
