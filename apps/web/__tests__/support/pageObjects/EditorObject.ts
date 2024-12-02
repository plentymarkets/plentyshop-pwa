import { PageObject } from "./PageObject";

export class EditorObject extends PageObject {
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

  assertEditModeToolbarVisible() {
    this.editPreviewButton.click(); 
    this.editorToolbar.should('be.visible');
    return this;
  }

  assertEditBlockActionsVisible() {
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
}