import { PageObject } from './PageObject';

export class FooterBlockObject extends PageObject {
  get footerSettingsDrawer() {
    return cy.getByTestId('footer-settings-drawer');
  }

  get firstColumnSection() {
    return cy.getByTestId('first-column-section');
  }

  get colorSection() {
    return cy.getByTestId('color-column-section');
  }

  get columnOneTitle() {
    return cy.getByTestId('input-title-column-1');
  }

  get lastBlockWrapper() {
    return cy.get('[data-testid*="block-wrapper"]').last();
  }

  assertVisible() {
    this.footer.scrollIntoView().should('be.visible');
    return this;
  }

  assertLinks() {
    this.footer.find('a').should('have.length.gte', 1);
    this.footer.find('a').first().should('have.attr', 'href').and('not.be.empty');
    return this;
  }

  assertNotMovableOrDeletable() {
    this.lastBlockWrapper.find('[data-testid="move-up-button"]').should('not.exist');
    this.lastBlockWrapper.find('[data-testid="move-down-button"]').should('not.exist');
    this.lastBlockWrapper.find('[data-testid="delete-block-button"]').should('not.exist');
    return this;
  }

  openSettingsDrawer() {
    cy.get('[data-testid^="toc-item-"]').last().click({ force: true });
    this.footerSettingsDrawer.should('be.visible');
    return this;
  }

  assertSettingsSections() {
    this.firstColumnSection.should('exist');
    this.colorSection.should('exist');
    return this;
  }

  assertColumnInteractive() {
    this.firstColumnSection.click();
    this.columnOneTitle.should('be.visible');
    return this;
  }

  changeColumnTitle(title: string) {
    this.firstColumnSection.click();
    this.columnOneTitle.clear().type(title);
    return this;
  }

  assertColumnTitleValue(title: string) {
    this.columnOneTitle.should('have.value', title);
    return this;
  }

  assertNotEditableOnPage() {
    this.footer.scrollIntoView();
    this.lastBlockWrapper.find('[data-testid="edit-block-actions"]').should('not.exist');
    return this;
  }
}
