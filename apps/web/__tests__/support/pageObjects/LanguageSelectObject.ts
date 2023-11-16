export class LanguageSelectObject {
  languageListNotEmpty() {
    // this.banners.should('be.visible');
    return this;
  }


  checkIfModalIsOpen() {
    cy.getByTestId('languageSelectList').first().should('be.visible');
    return this;
  }

  checkOptions() {
    // should also check for flags svg present ?
    cy.getByTestId('languageOption-en').should('be.visible');
    cy.getByTestId('languageOption-de').should('be.visible');
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

}
