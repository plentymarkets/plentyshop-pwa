import { PageObject } from './PageObject';

export class HeaderBlockObject extends PageObject {
  private originalNavBgColor = '';
  get headerContainer() {
    return cy.getByTestId('header-container');
  }

  get categoryButtons() {
    return cy.getByTestId('category-button');
  }

  get wishlistButton() {
    return cy.getByTestId('wishlist-page-navigation');
  }

  get cartBadge() {
    return cy.getByTestId('cart-badge');
  }

  get accountButton() {
    return cy.getByTestId('person');
  }

  get headerBlockWrapper() {
    return cy.get('.header-blocks [data-testid*="block-wrapper"]').first();
  }

  get headerContainerForm() {
    return cy.getByTestId('header-container-form');
  }

  get editChildButton() {
    return cy.getByTestId('actions-edit-item-1');
  }

  get childMenuButton() {
    return cy.getByTestId('actions-menu-item-0');
  }

  get childVisibilityToggle() {
    return cy.getByTestId('actions-toggle-visibility-item-0');
  }

  get childDeleteButton() {
    return cy.getByTestId('actions-delete-item-0');
  }

  get childDragHandle() {
    return cy.getByTestId('actions-drag-item-handle-0');
  }

  get stickyToggle() {
    return this.headerContainerForm.find('[data-testid="field-toggle"] input[role="switch"]');
  }

  get addElementButton() {
    return cy.getByTestId('actions-add-block-button');
  }

  get navigationForm() {
    return cy.getByTestId('layout-settings');
  }

  get navigationBackgroundColorInput() {
    return cy.getByTestId('input-background-color');
  }

  get headerBlockActions() {
    return cy.get('.header-blocks [data-testid="edit-block-actions"]');
  }

  assertVisible() {
    this.headerContainer.should('be.visible');
    return this;
  }

  assertNavigation() {
    this.categoryButtons.should('have.length.gte', 1);
    return this;
  }

  assertActionButtons() {
    this.wishlistButton.should('be.visible');
    this.cartBadge.should('exist');
    this.accountButton.should('be.visible');
    return this;
  }

  navigateToCategory() {
    cy.intercept('/plentysystems/getFacet').as('getFacet');
    this.categoryButtons.first().click();
    cy.wait('@getFacet');
    cy.getByTestId('category-page-content').should('be.visible');
    return this;
  }

  assertNotMovableOrDeletable() {
    this.headerBlockWrapper.find('[data-testid="move-up-button"]').should('not.exist');
    this.headerBlockWrapper.find('[data-testid="move-down-button"]').should('not.exist');
    this.headerBlockWrapper.find('[data-testid="delete-block-button"]').should('not.exist');
    return this;
  }

  storeNavigationBackgroundColor() {
    this.navigationBackgroundColorInput.invoke('val').then((val) => {
      this.originalNavBgColor = val as string;
    });
    return this;
  }

  restoreNavigationBackgroundColor() {
    cy.then(() => {
      this.navigationBackgroundColorInput.clear().type(this.originalNavBgColor);
    });
    return this;
  }

  openHeaderContainerForm() {
    cy.get('[data-testid^="toc-item-"]').first().click({ force: true });
    cy.getByTestId('block-edit-view').should('be.visible');
    this.headerContainerForm.should('be.visible');
    return this;
  }

  assertChildrenListedWithActions() {
    this.editChildButton.should('exist');
    this.childDragHandle.should('exist');
    this.childMenuButton.should('exist');
    return this;
  }

  openChildMenu() {
    this.childMenuButton.click();
    this.childVisibilityToggle.should('be.visible');
    this.childDeleteButton.should('be.visible');
    return this;
  }

  closeChildMenu() {
    cy.get('body').click(0, 0);
    this.childVisibilityToggle.should('not.exist');
    return this;
  }

  editNavigationChild() {
    this.editChildButton.click();
    this.navigationForm.should('exist');
    return this;
  }

  changeNavigationBackgroundColor(color: string) {
    this.navigationForm.click();
    this.navigationBackgroundColorInput.clear().type(color);
    return this;
  }

  goBackToHeaderContainerForm() {
    cy.getByTestId('view-title').find('button').click();
    this.headerContainerForm.should('be.visible');
    return this;
  }

  toggleSticky() {
    this.stickyToggle.click({ force: true });
    return this;
  }

  assertHeaderIsSticky() {
    cy.get('.header-blocks').should('have.class', 'sticky');
    return this;
  }

  assertHeaderIsNotSticky() {
    cy.get('.header-blocks').should('not.have.class', 'sticky');
    return this;
  }

  addElement() {
    this.addElementButton.click();
    return this;
  }

  selectTextBlockToAdd() {
    cy.getByTestId('block-category-text').click({ force: true });
    cy.wait(500);
    cy.get('[data-testid*="block-add-text-0"]').click({ force: true });
    cy.wait(1000);
    return this;
  }

  assertChildCount(count: number) {
    cy.get('[data-testid^="actions-edit-item-"]').should('have.length', count);
    return this;
  }

  editLastChild() {
    cy.get('[data-testid^="actions-edit-item-"]').last().click();
    cy.getByTestId('block-edit-view').should('be.visible');
    return this;
  }

  typeButtonLabel(label: string) {
    cy.getByTestId('button-settings').click();
    cy.getByTestId('input-button-label').clear().type(label);
    cy.getByTestId('input-button-link').clear().type('/test');
    return this;
  }

  assertButtonLabelOnPage(label: string) {
    cy.get('.header-blocks').find('[data-testid="text-button"]').last().should('contain.text', label);
    return this;
  }

  assertNotEditableOnPage() {
    this.headerBlockActions.should('not.exist');
    return this;
  }
}
