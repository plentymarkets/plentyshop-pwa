import { PageObject } from './PageObject';

export class ImageTextObject extends PageObject {
  openImageSelector(imageType: string) {
    cy.get(`[data-testid="image-picker-select-button-${imageType}"]`).should('be.visible').click();
    cy.get('[data-testid="image-selector-modal"]').should('be.visible');
    cy.get('[data-testid="image-selector-loader"]').should('not.exist');
  }

  selectImage() {
    cy.get('[data-testid="image-selector-modal"]').should('be.visible');
    cy.get('[data-testid="image-table-file-name"]').should('be.visible').click();
    cy.get('[data-testid="image-uploader-add-button"]').should('be.visible').click();
    cy.get('[data-testid="image-selector-modal"]').should('not.exist');
  }

  checkNewImage() {
    cy.get('[data-testid="image-block-image"]').should(
      'have.attr',
      'src',
      'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/123-demo-picture.jpeg',
    );
  }
}
