export class NotifyMeObject {
  get notifyMeButton() {
    return cy.getByTestId('notify-me-button');
  }

  get notifyMeModal() {
    return cy.getByTestId('notify-me-modal');
  }

  get notifyMeEmailInput() {
    return cy.get('#email');
  }

  get notifyMePrivacyCheckbox() {
    return cy.get('#privacy-policy');
  }

  get notifyMeSubmitButton() {
    return this.notifyMeModal.getByTestId('notify-me-submit');
  }

  get notifyMeCloseButton() {
    return this.notifyMeModal.getByTestId('notify-me-modal-close');
  }

  openModal() {
    this.notifyMeButton.should('be.visible').click();
    this.notifyMeModal.should('be.visible');
  }

  checkModalClosed() {
    cy.getByTestId('notify-me-modal').should('not.exist');
  }

  checkModalOpen() {
    cy.getByTestId('notify-me-modal').should('exist');
  }

  fillAndSubmitModal(email: string) {
    this.notifyMeEmailInput.should('be.visible').clear().type(email);
    this.notifyMePrivacyCheckbox.should('be.visible').check();
    this.notifyMeSubmitButton.should('be.visible');
    this.notifyMeSubmitButton.should('not.be.disabled').click();

    return this;
  }
}
