import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { ImageTextObject } from '../../support/pageObjects/ImageTextObject';
import { paths } from '../../../app/utils/paths';

describe('Image Text Block Form', () => {
  const imageText = new ImageTextObject();

  const openImageInGrid = () => {
    cy.get('[data-testid="multi-grid-structure"]').children().should('have.length', 2);
    cy.get('[data-testid="multi-grid-structure"]').within(() => {
      cy.get('[data-testid="open-editor-button"]').first().should('exist').click({ force: true });
    });
    cy.get('[data-testid="image-group"]').should('exist').click();
  };

  const changeAltText = () => {
    cy.get('[data-testid="alt-input"]').should('exist').clear().type('New Alt Text', { delay: 0 });
    cy.get('[data-testid="image-block-image"]').should('have.attr', 'alt', 'New Alt Text');
  };

  const openTextInGrid = () => {
    cy.get('[data-testid="multi-grid-structure"]').children().should('have.length', 2);
    cy.get('[data-testid="multi-grid-structure"]').within(() => {
      cy.get('[data-testid="open-editor-button"]').last().should('exist').click({ force: true });
    });
    cy.get('[data-testid="open-text-settings"]').should('exist').click();
  };

  const changeText = () => {
    const textInputs = [
      { selector: 'input-pretitle', text: 'New Pre title' },
      { selector: 'input-main-title', text: 'New title' },
      { selector: 'input-subtitle', text: 'New sub title' },
      { selector: 'textarea-description', text: 'New Text Area Content' },
    ];

    textInputs.forEach(({ selector, text }) => {
      cy.get(`[data-testid="${selector}"]`)
        .should('exist')
        .clear({ force: true })
        .type(text, { delay: 0, force: true });
    });
    cy.get('[data-testid="multi-grid-structure"]').scrollIntoView().should('exist');
    cy.get('[data-testid="multi-grid-structure"]').within(() => {
      const expectedTexts = [
        { selector: 'text-pretitle', text: 'New Pre title' },
        { selector: 'text-title', text: 'New title' },
        { selector: 'text-subtitle', text: 'New sub title' },
        { selector: 'text-html', text: 'New Text Area Content' },
      ];

      expectedTexts.forEach(({ selector, text }) => {
        cy.get(`[data-testid="${selector}"]`).should('have.text', text);
      });
    });
  };

  const changeTextColor = () => {
    cy.get('[data-testid="input-text-color"]').should('exist').clear().type('rgb(121, 12, 12)', { delay: 0 });
    cy.wait(1000);
    cy.getByTestId('multi-grid-structure').within(() =>
      cy.getByTestId('text-content').should('have.css', 'color', 'rgb(121, 12, 12)'),
    );
  };

  const changeTextAlignment = () => {
    cy.get('[data-testid="text-align-center"]').should('exist').click();

    cy.get('[data-testid="text-content"]').should('have.class', 'text-center');

    cy.get('[data-testid="text-align-right"]').should('exist').click();

    cy.get('[data-testid="text-content"]').should('have.class', 'text-right');

    cy.get('[data-testid="text-align-left"]').should('exist').click();

    cy.get('[data-testid="text-content"]').should('have.class', 'text-left');
  };

  const openButtonGroup = () => {
    cy.get('[data-testid="button-settings"]').should('exist').click();
  };

  const changeButtonLabel = () => {
    cy.get('[data-testid="input-button-label"]').should('exist').clear().type('New Button Label', { delay: 0 });
    cy.get('[data-testid="text-button"]').should('have.text', 'New Button Label');
  };

  const changeButtonLink = () => {
    cy.get('[data-testid="input-button-link"]').should('exist').clear().type('https://www.google.com', { delay: 0 });
    cy.get('[data-testid="text-button"]').should('have.attr', 'href', 'https://www.google.com');
  };

  const changeButtonVariants = () => {
    cy.get('[data-testid="button-outline-secondary"]').should('exist').click();
    cy.get('[data-testid="text-button"]').should('have.class', 'active:text-primary-900');
    cy.get('[data-testid="button-outline-primary"]').should('exist').click();
    cy.get('[data-testid="text-button"]').should('have.class', 'active:bg-primary-700');
  };

  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.intercept('plentysystems/getStorageItems', {
      statusCode: 200,
      body: {
        data: [
          {
            key: '123-demo-picture.jpeg',
            lastModified: '2025-08-06T11:06:05+00:00',
            eTag: '4db976b8578d71ee74710e48ad01dc35',
            size: '1009370',
            storageClass: 'STANDARD',
            publicUrl: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/123-demo-picture.jpeg',
            previewUrl: 'https://cdn02.plentymarkets.com/mevofvd5omld/frontend/.thumbs/123-demo-picture.jpeg',
          },
        ],
      },
    }).as('getStorageItems');
    cy.intercept('plentysystems/getStorageMetadata', { statusCode: 200, body: {} }).as('getStorageMetadata');

    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should change image settings', () => {
    openImageInGrid();
    imageText.openImageSelector('wideScreen');
    imageText.selectImage();
    imageText.checkNewImage();
    changeAltText();
  });

  it('should test the text settings', () => {
    openTextInGrid();
    changeText();
    changeTextColor();
    changeTextAlignment();
    openButtonGroup();
    changeButtonLabel();
    changeButtonLink();
    changeButtonVariants();
  });
});
