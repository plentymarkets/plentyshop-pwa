import { PageObject } from './PageObject';

export class BannerSliderObject extends PageObject {
  getFirstBannerBlockUuid(): Cypress.Chainable<string> {
    return cy
      .get('[data-testid^="banner-image-"]')
      .first()
      .then(($el) => {
        const testId = $el.attr('data-testid') || '';
        return testId.replace('banner-image-', '');
      });
  }

  getSecondBannerBlockUuid(): Cypress.Chainable<string> {
    return cy
      .get('[data-testid^="banner-image-"]')
      .eq(1)
      .then(($el) => {
        const testId = $el.attr('data-testid') || '';
        return testId.replace('banner-image-', '');
      });
  }

  checkDroneImageVisibility() {
    cy.get(`[data-testid="tooltip"]`).contains('drone-A-1024.avif');
  }

  checkGuyImageVisibility() {
    cy.get(`[data-testid="tooltip"]`).contains('guy-1024.avif');
  }

  openSlideActions() {
    cy.get(`[data-testid="actions-menu-item-0"]`).click();
  }

  openSlideOneSettings() {
    cy.get('[data-testid="actions-edit-item-0"]').click();
  }

  openSlideTwoSettings() {
    cy.get('[data-testid="actions-edit-item-1"]').click();
  }

  goBackToElementList() {
    cy.get('[data-testid="view-title"] button').first().click();
  }

  deleteSlide() {
    cy.get('[data-testid="actions-delete-item-0"]').click();
  }

  checkIfSlideIsDeleted() {
    cy.get('[data-testid^="banner-image-"]').should('have.length', 1);
    cy.get('[data-testid="actions-menu-slide-1"]').should('not.exist');
  }

  checkIfSlideActionsAreVisible() {
    cy.get('[data-testid="actions-menu-slide-1"]').should('not.exist');
  }

  quickAddSlide() {
    cy.get('[data-testid="actions-add-block-button"]').click();
  }

  checkSlideSettings(index: number) {
    cy.get(`[data-testid="actions-edit-slide-${index}"]`).click();
  }

  checkIsBannerImageVisible(index = 0) {
    cy.get('[data-testid^="banner-image-"]').eq(index).should('be.visible');
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

  openImageGroup() {
    cy.get('[data-testid="slider-image-group"]').should('exist').click();
  }

  openImageSelector(imageType: string) {
    cy.get(`[data-testid="image-picker-select-button-${imageType}"]`).scrollIntoView().should('be.visible').click();
    cy.get('[data-testid="image-selector-modal"]').should('be.visible');
    cy.get('[data-testid="image-selector-loader"]').should('not.exist');
  }

  selectImage() {
    cy.get('[data-testid="image-selector-modal"]').should('be.visible');
    cy.get('[data-testid="image-table-file-name"]').should('be.visible').click();
    cy.get('[data-testid="image-uploader-add-button"]').should('be.visible').click();
    cy.get('[data-testid="image-selector-modal"]').should('not.exist');
  }

  checkNewBannerImage() {
    cy.get('[data-testid^="banner-image-"]').first().should('be.visible');
    cy.get('[data-testid^="banner-image-"]')
      .first()
      .should('have.attr', 'src', 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/123-demo-picture.jpeg');
  }

  checkBannerAltText() {
    cy.get('[data-testid="slide-alt-text"]')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type('New Alt Text', { delay: 0 });
    cy.get('[data-testid^="banner-image-"]').first().should('have.attr', 'alt', 'New Alt Text');
  }

  closeImageGroup() {
    cy.get('[data-testid="slider-image-group"]').scrollIntoView().should('be.visible').click();
  }

  openTextGroup() {
    cy.get('[data-testid="banner-text-group"]').scrollIntoView().should('be.visible').click();
  }

  changeTexts() {
    cy.get('[data-testid="rte-editor"]')
      .scrollIntoView()
      .should('be.visible')
      .find('[contenteditable="true"]')
      .click()
      .clear()
      .type('New Pre-Title', { delay: 0 });
  }

  checkNewTexts() {
    cy.get('[data-testid^="text-html"]').first().should('have.text', 'New Pre-Title');
  }

  scrollFormDown() {
    cy.get('[data-testid="banner-carousel-form"]').scrollTo('bottom');
  }

  alignBoxCenterX() {
    cy.get('[data-testid="slider-textbox-align-center"]').should('exist').click();
    cy.get('[data-testid^="banner-overlay-"]').first().should('have.css', 'justify-content', 'center');
  }

  alignBoxBottomX() {
    cy.get('[data-testid="slider-textbox-align-bottom"]').should('exist').click();
    cy.get('[data-testid^="banner-overlay-"]').first().should('have.css', 'justify-content', 'flex-end');
  }

  alignBoxTopX() {
    cy.get('[data-testid="slider-textbox-align-top"]').should('exist').click();
    cy.get('[data-testid^="banner-overlay-"]').first().should('have.css', 'justify-content', 'flex-start');
  }

  alignBoxCenterY() {
    cy.get('[data-testid="slider-textbox-y-align-center"]').should('exist').click();
    cy.get('[data-testid^="banner-overlay-"]').first().should('have.css', 'align-items', 'center');
  }

  alignBoxRightY() {
    cy.get('[data-testid="slider-textbox-y-align-right"]').should('exist').click();
    cy.get('[data-testid^="banner-overlay-"]').first().should('have.css', 'align-items', 'flex-end');
  }

  alignBoxLeftY() {
    cy.get('[data-testid="slider-textbox-y-align-left"]').should('exist').click();
    cy.get('[data-testid^="banner-overlay-"]').first().should('have.css', 'align-items', 'flex-start');
  }

  textAlignCenter() {
    cy.get('[data-testid="rte-editor"]').find('[contenteditable="true"]').click().type('{selectall}');
    cy.get('[data-testid="rte-align-center"]').click();
    cy.get('[data-testid="rte-editor"]')
      .find('[contenteditable="true"] p')
      .first()
      .should('have.css', 'text-align', 'center');
  }

  textAlignRight() {
    cy.get('[data-testid="rte-editor"]').find('[contenteditable="true"]').click().type('{selectall}');
    cy.get('[data-testid="rte-align-right"]').click();
    cy.get('[data-testid="rte-editor"]')
      .find('[contenteditable="true"] p')
      .first()
      .should('have.css', 'text-align', 'right');
  }

  textAlignLeft() {
    cy.get('[data-testid="rte-editor"]').find('[contenteditable="true"]').click().type('{selectall}');
    cy.get('[data-testid="rte-align-left"]').click();
    cy.get('[data-testid="rte-editor"]')
      .find('[contenteditable="true"] p')
      .first()
      .should('have.css', 'text-align', 'left');
  }

  closeTextGroup() {
    cy.get('[data-testid="banner-text-group"]').scrollIntoView().should('be.visible').click();
  }

  openButtonGroup() {
    cy.get('[data-testid="slider-button-group-title"]').scrollIntoView().should('be.visible').click();
  }

  changeButtonLabelAndLink() {
    cy.get('[data-testid="slider-button-label"]')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type('New Button Label', { delay: 0 });
    cy.get('[data-testid="slider-button-link"]')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type('https://www.google.com', { delay: 0 });
  }

  checkButtonLabelAndLink() {
    cy.get('[data-testid^="banner-button-"]')
      .first()
      .should('have.text', 'New Button Label')
      .should('have.attr', 'href', 'https://www.google.com');
  }

  checkButtonSecondary() {
    cy.get('[data-testid="slider-button-secondary"]').should('exist').click();
    cy.get('[data-testid^="banner-button-"]').first().should('have.class', 'active:text-primary-900');
  }

  checkButtonPrimary() {
    cy.get('[data-testid="slider-button-primary"]').should('exist').click();
    cy.get('[data-testid^="banner-button-"]').first().should('have.class', 'active:bg-primary-700');
  }
}
