import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';

describe('Image Text Block Form', () => {
  const openSettingsForImageTextBlock = () => {
    cy.get('[data-testid="open-editor-button"]').should('have.length.at.least', 4);

    cy.get('[data-testid="open-editor-button"]').eq(3).should('exist').click({ force: true });
    cy.wait(1000);

    cy.get('[data-testid="image-text-form"]').should('exist');
  };

  const openImageGroup = () => {
    cy.get('[data-testid="image-group"]').should('exist').click();
  };

  const changeImage = () => {
    cy.get('[data-testid="wide-screen-input"]')
      .should('exist')
      .clear()
      .type('https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png', { delay: 0 });
    cy.get('[data-testid="large-screen-input"]')
      .should('exist')
      .clear()
      .type('https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png', { delay: 0 });
    cy.get('[data-testid="medium-screen-input"]')
      .should('exist')
      .clear()
      .type('https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png', { delay: 0 });
    cy.get('[data-testid="image-block"]').should(
      'have.attr',
      'src',
      'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
    );
  };

  const changeAltText = () => {
    cy.get('[data-testid="alt-input"]').should('exist').clear().type('New Alt Text', { delay: 0 });
    cy.get('[data-testid="image-block"]').should('have.attr', 'alt', 'New Alt Text');
  };

  const changeImageGridLayout = () => {
    cy.get('[data-testid="image-align-right"]').should('exist').click();
    cy.get('[data-testid="image-align-left"]').should('exist').click();
  };

  const openTextGroup = () => {
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
    cy.get('[data-testid="multi-grid-structure"]').should('have.css', 'color', 'rgb(121, 12, 12)');
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
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    openSettingsForImageTextBlock();
  });

  it('should change image settings', () => {
    openImageGroup();
    changeImage();
    changeAltText();
    changeImageGridLayout();
    openImageGroup();
  });

  it('should test the text settings', () => {
    openTextGroup();
    changeText();
    changeTextColor();
    changeTextAlignment();
  });

  it('should change button settings', () => {
    openButtonGroup();
    changeButtonLabel();
    changeButtonLink();
    changeButtonVariants();
  });
});
