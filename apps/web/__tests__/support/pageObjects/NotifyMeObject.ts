export class NotifyMeObject {
  get notifyMeButton() {
    return cy.getByTestId('notify-me-button');
  }

  get notifyMeModal() {
    return cy.get('[role="dialog"]').closest('[role="dialog"]');
  }

  get notifyMeModalTitle() {
    return cy.get('#notify-modal-title');
  }

  get notifyMeEmailInput() {
    return cy.get('#email');
  }

  get notifyMePrivacyCheckbox() {
    return cy.get('#privacy-policy');
  }

  get notifyMeSubmitButton() {
    return this.notifyMeModal.find('button[type="submit"]');
  }

  get notifyMeCloseButton() {
    return this.notifyMeModal.find('button').first(); // Der X-Button ist der erste Button
  }

  openModal() {
    this.notifyMeButton.should('be.visible').click();
    this.notifyMeModal.should('be.visible');
  }

  checkModalClosed() {
    cy.get('[role="dialog"]').should('not.exist');
  }

  checkModalOpen() {
    cy.get('[role="dialog"]').should('exist');
  }

  fillAndSubmitModal(email: string) {
    this.notifyMeEmailInput.should('be.visible').clear().type(email);
    this.notifyMePrivacyCheckbox.should('be.visible').check();
    this.notifyMeSubmitButton.should('be.visible');
    this.notifyMeSubmitButton.should('not.be.disabled').click();

    return this;
  }
}
