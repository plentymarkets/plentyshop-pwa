import { PageObject } from '../../support/pageObjects/PageObject';

export const firstBannerBlockUuid = 'a7b3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d';
export const secondBannerBlockUuid = 'd4e1f2a3-b7c8-4d9e-8f1a-2b3c4d5e6f7a';

export class BannerSliderObject extends PageObject {
  openSlideActions() {
    cy.get('[data-testid="open-slide-actions"]').click();
  }

  openSlideOneSettings() {
    cy.get('[data-testid="slide-settings-1"]').click();
  }

  openSlideTwoSettings() {
    cy.get('[data-testid="slide-settings-2"]').click();
  }

  addSlide() {
    cy.get('[data-testid="actions-add-slide-button"]').click();
  }

  deleteSlide() {
    cy.get('[data-testid="actions-delete-slide-1"]').click();
  }

  checkIfSlideIsDeleted() {
    cy.get(`[data-testid="banner-image-${secondBannerBlockUuid}"]`).should('not.exist');
    cy.get('[data-testid="open-slide-actions"]').should('not.exist');
  }

  checkIfSlideActionsAreVisible() {
    cy.get('[data-testid="open-slide-actions"]').should('not.exist');
  }
  quickAddSlide() {
    cy.get('[data-testid="quick-add-slide-button"]').click();
  }

  checkSlideSettings(index: number) {
    cy.get(`[data-testid="slide-settings-${index}"]`).should('exist');
  }

  checkIsBannerImageVisible(uuid: string) {
    cy.get(`[data-testid="banner-image-${uuid}"]`).should('be.visible');
  }

  checkIsNewBannerImageVisible() {
    cy.get('[data-testid^="banner-image-"]').should('have.length', 3);

    cy.get('[data-testid^="banner-image-"]:visible').should(($el) => {
      const testId = $el.attr('data-testid') || '';
      const uuid = testId.replace('banner-image-', '');

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(uuid).to.match(uuidRegex);
    });
  }

  checkIsMoveSlideUpDisabled(index: number) {
    cy.get(`[data-testid="actions-drag-slide-handle-${index}"]`).should('not.exist');
  }

  checkIsMoveSlideDownDisabled(index: number) {
    cy.get(`[data-testid="actions-drag-slide-handle-${index}"]`).should('not.exist');
  }

  moveSlideUp(index: number) {
    cy.get(`[data-testid="actions-drag-slide-handle-${index}"]`)
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 0, clientY: -100 })
      .trigger('mouseup', { force: true });
  }

  moveSlideDown(index: number) {
    cy.get(`[data-testid="actions-drag-slide-handle-${index}"]`)
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 0, clientY: 100 })
      .trigger('mouseup', { force: true });
  }

  openImageGroup() {
    cy.get(`[data-testid="banner-image-${firstBannerBlockUuid}"]`).should('be.visible');
  }

  changeBannerImage() {
    cy.get('[data-testid="slide-4xl-image-input"]')
      .should('be.visible')
      .clear()
      .type('https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png', { delay: 0 });
    cy.get('[data-testid="slide-desktop-image-input"]')
      .should('be.visible')
      .clear()
      .type('https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png', { delay: 0 });
  }

  checkNewBannerImage() {
    cy.get(`[data-testid="banner-image-${firstBannerBlockUuid}"]`).should('be.visible');
    cy.get(`[data-testid="banner-image-${firstBannerBlockUuid}"]`).should(
      'have.attr',
      'src',
      'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
    );
  }

  checkBannerAltText() {
    cy.get('[data-testid="slide-alt-text"]').should('be.visible').clear().type('New Alt Text', { delay: 0 });
    cy.get(`[data-testid="banner-image-${firstBannerBlockUuid}"]`).should('have.attr', 'alt', 'New Alt Text');
  }

  closeImageGroup() {
    cy.get('[data-testid="slider-image-group-title"]').should('be.visible').click();
  }

  openTextGroup() {
    cy.get('[data-testid="banner-text-group"]').should('be.visible').scrollIntoView().click();
  }

  changeTexts() {
    cy.get('[data-testid="banner-input-pre-title"]').should('be.visible').clear().type('New Pre-Title', { delay: 0 });
    cy.get('[data-testid="banner-input-title"]').should('be.visible').clear().type('New Title', { delay: 0 });
    cy.get('[data-testid="banner-input-sub-title"]').should('be.visible').clear().type('New Subtitle', { delay: 0 });
    cy.get('[data-testid="banner-text-content"]').should('be.visible').clear().type('New Text Content', { delay: 0 });
  }

  checkNewTexts() {
    cy.get(`[data-testid="banner-pretitle-${firstBannerBlockUuid}"]`).should('have.text', 'New Pre-Title');
    cy.get(`[data-testid="banner-title-${firstBannerBlockUuid}"]`).should('have.text', 'New Title');
    cy.get(`[data-testid="banner-subtitle-${firstBannerBlockUuid}"]`).should('have.text', 'New Subtitle');
    cy.get(`[data-testid="banner-description-${firstBannerBlockUuid}"]`).should('have.text', 'New Text Content');
  }

  scrollFormDown() {
    cy.get('[data-testid="banner-carousel-form"]').scrollTo('bottom');
  }

  alignBoxCenterX() {
    cy.get('[data-testid="slider-textbox-align-center"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'justify-content', 'center');
  }

  alignBoxBottomX() {
    cy.get('[data-testid="slider-textbox-align-bottom"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'justify-content', 'flex-end');
  }

  alignBoxTopX() {
    cy.get('[data-testid="slider-textbox-align-top"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should(
      'have.css',
      'justify-content',
      'flex-start',
    );
  }

  alignBoxCenterY() {
    cy.get('[data-testid="slider-textbox-y-align-center"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'align-items', 'center');
  }

  alignBoxRightY() {
    cy.get('[data-testid="slider-textbox-y-align-right"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'align-items', 'flex-end');
  }

  alignBoxLeftY() {
    cy.get('[data-testid="slider-textbox-y-align-left"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'align-items', 'flex-start');
  }

  textAlignCenter() {
    cy.get('[data-testid="slider-text-align-center"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'text-align', 'center');
  }

  textAlignRight() {
    cy.get('[data-testid="slider-text-align-right"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'text-align', 'right');
  }

  textAlignLeft() {
    cy.get('[data-testid="slider-text-align-left"]').should('exist').click();
    cy.get(`[data-testid="banner-overlay-${firstBannerBlockUuid}"]`).should('have.css', 'text-align', 'left');
  }

  closeTextGroup() {
    cy.get('[data-testid="slider-text-group-title"]').should('be.visible').click();
  }

  openButtonGroup() {
    cy.get('[data-testid="slider-button-group-title"]').should('be.visible').click();
  }

  changeButtonLabelAndLink() {
    cy.get('[data-testid="slider-button-label"]').should('be.visible').clear().type('New Button Label', { delay: 0 });
    cy.get('[data-testid="slider-button-link"]')
      .should('be.visible')
      .clear()
      .type('https://www.google.com', { delay: 0 });
  }

  checkButtonLabelAndLink() {
    cy.get(`[data-testid="banner-button-${firstBannerBlockUuid}"]`)
      .should('have.text', 'New Button Label')
      .should('have.attr', 'href', 'https://www.google.com');
  }

  checkButtonSecondary() {
    cy.get('[data-testid="slider-button-secondary"]').should('exist').click();
    cy.get(`[data-testid="banner-button-${firstBannerBlockUuid}"]`).should('have.class', 'active:text-primary-900');
  }

  checkButtonPrimary() {
    cy.get('[data-testid="slider-button-primary"]').should('exist').click();
    cy.get(`[data-testid="banner-button-${firstBannerBlockUuid}"]`).should('have.class', 'active:bg-primary-700');
  }
}
