import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';

describe('Text Card Block Form', () => {
  const openSettingsForTextCardBlock = () => {
    cy.get('[data-testid="open-editor-button"]').should('have.length.at.least', 4);

    cy.get('[data-testid="open-editor-button"]').eq(1).should('exist').click({ force: true });
    cy.wait(1000);

    cy.get('[data-testid="text-card-form"]').should('exist');
  };

  const openTextGroup = () => {
    cy.get('[data-testid="open-text-settings"]').should('exist').click();
  };

  const editText = () => {
    const textInputs = [
      { selector: 'input-pretitle', text: 'Edited Pre-title' },
      { selector: 'input-main-title', text: 'Edited Main Title' },
      { selector: 'input-subtitle', text: 'Edited Subtitle' },
      { selector: 'textarea-description', text: 'Edited HTML Description' },
    ];

    textInputs.forEach(({ selector, text }) => {
      cy.get(`[data-testid="${selector}"]`)
        .should('exist')
        .clear({ force: true })
        .type(text, { delay: 0, force: true });
    });
    cy.get('[data-testid="text-card"]').first().scrollIntoView().should('exist');
    cy.get('[data-testid="text-card"]')
      .first()
      .within(() => {
        const expectedTexts = [
          { selector: 'text-pretitle', text: 'Edited Pre-title' },
          { selector: 'text-title', text: 'Edited Main Title' },
          { selector: 'text-subtitle', text: 'Edited Subtitle' },
          { selector: 'text-html', text: 'Edited HTML Description' },
        ];

        expectedTexts.forEach(({ selector, text }) => {
          cy.get(`[data-testid="${selector}"]`).should('have.text', text);
        });
      });
  };
  const changeTextColor = () => {
    cy.get('[data-testid="input-text-color"]').should('exist').clear().type('rgb(121, 12, 12)', { delay: 0 });
    cy.wait(1000);
    cy.get('[data-testid="text-content"]').should('have.css', 'color', 'rgb(121, 12, 12)');
  };
  const changeTextAlignment = () => {
    cy.get('[data-testid="text-align-center"]').should('exist').click({ force: true });

    cy.get('[data-testid="text-content"]').should('have.class', 'text-center');

    cy.wait(500);
    cy.get('[data-testid="text-align-right"]').should('exist').click({ force: true });

    cy.get('[data-testid="text-content"]').should('have.class', 'text-right');

    cy.wait(500);

    cy.get('[data-testid="text-align-left"]').should('exist').click({ force: true });

    cy.get('[data-testid="text-content"]').should('have.class', 'text-left');
  };
  const openButtonGroup = () => {
    cy.get('[data-testid="button-settings"]').should('exist').click();
  };

  const changeButtonLink = () => {
    cy.get('[data-testid="input-button-link"]').should('exist').clear().type('https://www.google.com', { delay: 0 });
    cy.get('[data-testid="text-button"]').should('have.attr', 'href', 'https://www.google.com');
  };

  const changeButtonLabel = () => {
    cy.get('[data-testid="input-button-label"]').should('exist').clear().type('New Button Label', { delay: 0 });

    cy.get('[data-testid="text-button"]').first().should('have.text', 'New Button Label');
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
    cy.setCookie('vsf-locale', 'en');
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    openSettingsForTextCardBlock();
  });

  it('should change the text settings', () => {
    openTextGroup();
    editText();
    changeTextColor();
    changeTextAlignment();
  });

  it('should change the button settings', () => {
    openButtonGroup();
    changeButtonLink();
    changeButtonLabel();
    changeButtonVariants();
  });
});
