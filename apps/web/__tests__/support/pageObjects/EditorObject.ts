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
    
    cy.log('Waiting for the textarea to render...');

  
    cy.get('body', { timeout: 30000 }) 
      .find('[data-testid="editor-textarea"]') 
      .should('exist') 
      .and('be.visible') 
      .invoke('attr', 'placeholder')
      .should('not.be.empty')
  }

   replaceEditorContent(content: string) {
    cy.get('body', { timeout: 30000 }) 
    .find('[data-testid="editor-textarea"]') 
    cy.get('body', { timeout: 30000 }) 
    .clear() 
    .type(content);
    
   }

}