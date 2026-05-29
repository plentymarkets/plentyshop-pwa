import { PageObject } from './PageObject';

export class DeviceToggleObject extends PageObject {
  get mobileButton() {
    return cy.getByTestId('device-toggle-mobile');
  }

  get tabletButton() {
    return cy.getByTestId('device-toggle-tablet');
  }

  get desktopButton() {
    return cy.getByTestId('device-toggle-desktop');
  }

  get previewContainer() {
    return cy.getByTestId('editor-preview-container');
  }

  get navbarBottom() {
    return cy.getByTestId('navbar-bottom');
  }

  selectMobile() {
    this.mobileButton.click();
    return this;
  }

  selectTablet() {
    this.tabletButton.click({ force: true }); // force is needed because the tablet button is covered by the mobile button label
    return this;
  }

  selectDesktop() {
    this.desktopButton.click({ force: true }); // force is needed because the desktop button is covered by the mobile button label
    return this;
  }

  assertMobileActive() {
    this.mobileButton.should('have.class', 'bg-gray-100');
    return this;
  }

  assertTabletActive() {
    this.tabletButton.should('have.class', 'bg-gray-100');
    return this;
  }

  assertDesktopActive() {
    this.desktopButton.should('have.class', 'bg-gray-100');
    return this;
  }

  assertPreviewWidth(expectedPx: number, tolerance = 5) {
    this.previewContainer.invoke('outerWidth').should('be.closeTo', expectedPx, tolerance);
    return this;
  }

  assertPreviewIsFullWidth() {
    this.previewContainer.invoke('attr', 'style').should('be.undefined');
    return this;
  }

  assertNavbarBottomVisible() {
    this.navbarBottom.should('exist').and('be.visible');
    return this;
  }
}
