import { PageObject } from './PageObject';

export class BlockSnapshotsObject extends PageObject {
  get snapshotDrawerButton() {
    return cy.getByTestId('snapshot-drawer-button');
  }

  get snapshotDrawer() {
    return cy.getByTestId('snapshot-drawer');
  }

  get snapshotCloseButton() {
    return cy.getByTestId('snapshot-drawer-close');
  }

  get snapshotItems() {
    return cy.getByTestId('snapshot-item');
  }

  get snapshotGroups() {
    return cy.getByTestId('snapshot-group');
  }

  get snapshotLoadingSpinner() {
    return cy.getByTestId('snapshot-loading');
  }

  get presetAllButton() {
    return cy.getByTestId('snapshot-preset-all');
  }

  get preset1dButton() {
    return cy.getByTestId('snapshot-preset-1d');
  }

  get preset7dButton() {
    return cy.getByTestId('snapshot-preset-7d');
  }

  get preset30dButton() {
    return cy.getByTestId('snapshot-preset-30d');
  }

  get dateFromInput() {
    return cy.getByTestId('snapshot-date-from');
  }

  get dateToInput() {
    return cy.getByTestId('snapshot-date-to');
  }

  get restoreButtons() {
    return cy.getByTestId('snapshot-restore-button');
  }

  get confirmRestoreButton() {
    return cy.getByTestId('snapshot-confirm-restore');
  }

  get cancelRestoreButton() {
    return cy.getByTestId('snapshot-cancel-restore');
  }

  get confirmRestoreDialog() {
    return cy.getByTestId('snapshot-confirm-dialog');
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
    this.snapshotDrawer.should('not.be.visible');
    return this;
  }

  checkDrawerVisible() {
    this.snapshotDrawer.should('be.visible');
    return this;
  }

  checkDrawerNotVisible() {
    this.snapshotDrawer.should('not.be.visible');
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
    this.confirmRestoreDialog.should('not.be.visible');
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
    cy.getByTestId('restore-success-notification').should('be.visible');
    return this;
  }

  checkFirstSnapshotActive() {
    this.snapshotItems.first().should('have.class', 'snapshot-active');
    return this;
  }

  checkSnapshotItemText(index: number, text: string) {
    this.snapshotItems.eq(index).should('contain.text', text);
    return this;
  }
}
