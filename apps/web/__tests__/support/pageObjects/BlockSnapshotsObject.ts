import { PageObject } from './PageObject';

export class BlockSnapshotsObject extends PageObject {
  get snapshotDrawerButton() {
    return cy.getByTestId('edit-history-button');
  }

  get snapshotDrawer() {
    return cy.getByTestId('version-history-drawer');
  }

  get snapshotCloseButton() {
    return cy.getByTestId('version-history-close');
  }

  get snapshotItems() {
    return cy.get('[data-testid^="version-history-item-"]');
  }

  get snapshotGroups() {
    return cy.getByTestId('version-history-list').find('div[class*="sticky"]');
  }

  get snapshotLoadingSpinner() {
    return cy.getByTestId('version-history-list').find('.animate-spin');
  }

  get presetAllButton() {
    return cy.getByTestId('version-history-preset-all');
  }

  get preset1dButton() {
    return cy.getByTestId('version-history-preset-1d');
  }

  get preset7dButton() {
    return cy.getByTestId('version-history-preset-7d');
  }

  get preset30dButton() {
    return cy.getByTestId('version-history-preset-30d');
  }

  get dateFromInput() {
    return cy.getByTestId('version-history-date-from');
  }

  get dateToInput() {
    return cy.getByTestId('version-history-date-to');
  }

  get customRangeToggle() {
    return cy.getByTestId('version-history-custom-range-toggle');
  }

  get restoreButtons() {
    return cy.get('[data-testid^="version-history-restore-"]');
  }

  get confirmRestoreButton() {
    return cy.getByTestId('restore-snapshot-confirm-button');
  }

  get cancelRestoreButton() {
    return cy.getByTestId('restore-snapshot-cancel-button');
  }

  get confirmRestoreDialog() {
    return cy.getByTestId('restore-snapshot-cancel-button').closest('[role="dialog"]');
  }

  getSnapshotItemByIndex(index: number) {
    return this.snapshotItems.eq(index);
  }

  openSnapshotDrawer() {
    this.snapshotDrawerButton.should('be.visible').click();
    this.snapshotDrawer.should('be.visible');
    return this;
  }

  closeSnapshotDrawer() {
    this.snapshotCloseButton.click();
    this.snapshotDrawer.should('not.exist');
    return this;
  }

  checkDrawerVisible() {
    this.snapshotDrawer.should('be.visible');
    return this;
  }

  checkDrawerNotVisible() {
    this.snapshotDrawer.should('not.exist');
    return this;
  }

  checkSnapshotsLoaded() {
    this.snapshotItems.should('have.length.greaterThan', 0);
    return this;
  }

  checkSnapshotCount(expectedCount: number) {
    this.snapshotItems.should('have.length', expectedCount);
    return this;
  }

  checkGroupsVisible() {
    this.snapshotGroups.should('have.length.greaterThan', 0);
    return this;
  }

  checkLoadingVisible() {
    this.snapshotLoadingSpinner.should('be.visible');
    return this;
  }

  checkLoadingNotVisible() {
    this.snapshotLoadingSpinner.should('not.be.visible');
    return this;
  }

  selectPresetAll() {
    this.presetAllButton.click();
    return this;
  }

  selectPreset1d() {
    this.preset1dButton.click();
    return this;
  }

  selectPreset7d() {
    this.preset7dButton.click();
    return this;
  }

  selectPreset30d() {
    this.preset30dButton.click();
    return this;
  }

  setDateFrom(date: string) {
    this.customRangeToggle.click();
    this.dateFromInput.type(date);
    return this;
  }

  setDateTo(date: string) {
    this.dateToInput.type(date);
    return this;
  }

  requestRestoreSnapshot(index: number = 0) {
    this.restoreButtons.eq(index).click();
    return this;
  }

  checkRestoreConfirmationVisible() {
    this.confirmRestoreDialog.should('be.visible');
    return this;
  }

  checkRestoreConfirmationNotVisible() {
    this.cancelRestoreButton.should('not.exist');
    return this;
  }

  confirmRestore() {
    this.confirmRestoreButton.click();
    return this;
  }

  cancelRestore() {
    this.cancelRestoreButton.click();
    return this;
  }

  checkSnapshotRestored() {
    this.getRestoreSuccessNotification().should('be.visible');
    return this;
  }

  checkFirstSnapshotActive() {
    this.snapshotItems.first().should('have.class', 'bg-editor-button/5');
    return this;
  }

  checkSnapshotItemText(index: number, text: string) {
    this.snapshotItems.eq(index).should('contain.text', text);
    return this;
  }

  getRestoreSuccessNotification() {
    return cy.getByTestId('notifications').contains('Version restored. Save changes to keep it.');
  }
}
