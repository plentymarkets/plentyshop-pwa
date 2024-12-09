import { PageObject } from "./PageObject";

export class EditorObject extends PageObject {
  get tagline() {
    return cy.getByTestId('tagline');
  }

  get headline() {
    return cy.getByTestId('headline');
  }

  get description() {
    return cy.getByTestId('description');
  }

  get editorToolbar() {
    return cy.getByTestId('edit-mode-toolbar');
  }

  get editPreviewButton() {
    return cy.getByTestId('edit-preview-button');
  }

  get editBlockActions() {
    return cy.getByTestId('edit-block-actions');
  }

  get openEditorButton() {
    return cy.getByTestId('open-editor-button');
  }

  get editorTextarea() {
    return cy.getByTestId('editor-textarea');
  }

  get exitEditorButton() {
    return cy.get('#close')
  }

  togglePreviewMode() {
    this.editPreviewButton.should('be.enabled').click({ force: true });
    this.editPreviewButton.should('contain.text', 'Preview');
    return this;
  }
  toggleEditMode() {
    this.editPreviewButton.should('be.enabled').click({ force: true });
    this.editPreviewButton.should('contain.text', 'Edit');
    return this;
  }

  isToolbarVisible() {
    this.editPreviewButton.click();
    this.editorToolbar.should('be.visible');
    return this;
  }

  isEditBlockVisible() {
    this.editPreviewButton.click();
    this.editBlockActions.should('be.visible');
    return this;
  }

  assertEditBlockActionsNotVisible() {
    this.editBlockActions.should('not.be.visible');
    return this;
  }

  openEditor() {
    this.openEditorButton.click();
    return this;
  }

  clearAndTypeInEditor(content: string) {
    this.editorTextarea.clear().type(content, { parseSpecialCharSequences: false });
    return this;
  }

  assertEditorContent(content: string) {
    this.editorTextarea.should('have.value', content);
    return this;
  }

  checkEditorContent() {
    this.openEditorButton.should('be.visible').first().click();

    cy.get('body', { timeout: 30000 })
      .find('[data-testid="editor-textarea"]')
      .should('exist')
      .and('be.visible')
      .invoke('attr', 'placeholder')
      .should('not.be.empty')
  }

  replaceEditorContent(content: string) {
    this.editorTextarea
      .should('be.visible')
      .then($el => {
        if ($el.prop('isContentEditable')) {
          cy.wrap($el).invoke('text', '');
        } else {
          cy.wrap($el).clear();
        }
      })
      .type(content, {delay: 0})
      .should('have.value', content);
  }

  checkEditorChanges() {
    this.exitEditorButton.get('#close').click({ force: true });
    this.tagline.should('have.text', 'New tagline from cypress');
    this.headline.should('have.text', 'New heading from cypress');
    this.description.should('have.text', 'Description from cypress.');
  }
}
