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

  get blockWrapper() {
    return cy.getByTestId('block-wrapper')
  }

  get topBlockButton(){
    return cy.getByTestId('top-add-block')
  }

  get bottomBlockButton(){
    return cy.getByTestId('bottom-add-block')
  }
  
  get deleteBlockButton(){
    return cy.getByTestId('delete-block-button')
  }

  get languageSwitcher() {
    return cy.getByTestId('language-select');
  }

  togglePreviewMode() {
    this.editPreviewButton.should('be.enabled').click();
    this.editPreviewButton.should('contain.text', 'Preview');
    return this;
  }
  toggleEditMode() {
    this.editPreviewButton.should('be.enabled').click();
    this.editPreviewButton.should('contain.text', 'Edit');
    return this;
  }

  isToolbarVisible() {
    this.editorToolbar.should('be.visible');
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
    this.openEditorButton.first().click({ force: true });

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

  buttonsExistWithGroupClasses() {
    this.blockWrapper.first()
      .should('exist')
      .and('have.class', 'group')
      .and('not.have.css', 'outline-style', 'solid');
    this.blockWrapper.first().within(() => {
      this.topBlockButton
        .should('exist')
        .and('have.class', 'group-hover:opacity-100')
        .and('have.class', 'group-focus:opacity-100');
      this.bottomBlockButton
        .should('exist')
        .and('have.class', 'group-hover:opacity-100')
        .and('have.class', 'group-focus:opacity-100');
      this.editBlockActions
        .should('exist')
        .and('have.class', 'group-hover:opacity-100')
        .and('have.class', 'group-focus:opacity-100');
    });

  }

  deleteBlock() {
    this.blockWrapper.then(initialBlocks => {
      const initialLength = initialBlocks.length;
      this.blockWrapper.first().should('exist');
      this.deleteBlockButton.eq(1).click();
      cy.wait(1000);
      this.blockWrapper.should('have.length', initialLength - 1);
    });
   }

   switchLanguage() {
    this.editPreviewButton.click();
    this.languageSwitcher.should('exist');
    this.languageSwitcher.select('de');
    cy.wait(3000);
    this.headline.first().should('have.text', 'Sound auf höchstem Niveau');
   }
}

