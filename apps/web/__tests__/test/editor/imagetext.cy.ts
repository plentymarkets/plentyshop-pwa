import { paths } from '../../../utils/paths';

describe('Text Form block test', () => {

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);
    cy.get('[data-testid="open-editor-button"]').should('have.length.at.least', 4); 

    cy.get('[data-testid="open-editor-button"]')
      .eq(3)
      .should('exist')
      .click({ force: true });
    cy.wait(1000);
    
    cy.get('[data-testid="image-text-form"]').should('exist');
  });


  it('should test the image group', () => {
    cy.get('[data-testid="image-group"]').should('exist').click();

    // Add all screens for safety except mobile! 
    cy.get('[data-testid="wide-screen-input"]').should('exist').clear().type("https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png", { delay: 0 });
    cy.get('[data-testid="large-screen-input"]').should('exist').clear().type("https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png", { delay: 0 });
    cy.get('[data-testid="medium-screen-input"]').should('exist').clear().type("https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png", { delay: 0 });

    cy.get('[data-testid="image-block"]').should('have.attr', 'src', 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png');
    cy.get('[data-testid="alt-input"]').should('exist').clear().type('New Alt Text', { delay: 0 });
    cy.get('[data-testid="image-block"]').should('have.attr', 'alt', 'New Alt Text');
    cy.get('[data-testid="image-align-right"]').should('exist').click();
    cy.get('[data-testid="text-image-parent"]').should('have.class', 'md:flex-row-reverse');
    cy.get('[data-testid="image-align-left"]').should('exist').click();
    cy.get('[data-testid="text-image-parent"]').should('have.class', 'md:flex-row');

  });


  it('should test the text group', () => {

    cy.get('[data-testid="text-group"]').should('exist').click();

    const textInputs = [
        { selector: 'input-pre-title', text: 'New Pre title' },
        { selector: 'input-title', text: 'New title' },
        { selector: 'input-sub-title', text: 'New sub title' },
        { selector: 'textarea-html', text: 'New Text Area Content' },
       
      ];
      
      textInputs.forEach(({ selector, text }) => {
        cy.get(`[data-testid="${selector}"]`)
          .should('exist')
          .clear({ force: true })
          .type(text, { delay: 0, force: true });
      });
      cy.get('[data-testid="text-image-parent"]').scrollIntoView().should('exist');
      cy.get('[data-testid="text-image-parent"]').within(() => {
        const expectedTexts = [
          { selector: 'text-pretitle', text: 'New Pre title' },
          { selector: 'text-title', text: 'New title' },
          { selector: 'text-subtitle', text: 'New sub title' },
          { selector: 'text-html', text: 'New Text Area Content' }
        ];
      
        expectedTexts.forEach(({ selector, text }) => {
          cy.get(`[data-testid="${selector}"]`).should('have.text', text);
        });
      });


      cy.get('[data-testid="color-picker"]').should('exist').clear().type('rgb(121, 12, 12)', { delay: 0 });
      cy.wait(1000);
      cy.get('[data-testid="text-image-parent"]')
      .should('have.css', 'color', 'rgb(121, 12, 12)');


cy.get('[data-testid="text-align-center"]').should('exist').click({ force: true });

cy.get('[data-testid="text-content"]')
  .should('have.class', 'text-center'); 

cy.wait(500);
cy.get('[data-testid="text-align-right"]').should('exist').click({ force: true });

cy.get('[data-testid="text-content"]')
  .should('have.class', 'text-right');

cy.wait(500); 

cy.get('[data-testid="text-align-left"]').should('exist').click({ force: true });

cy.get('[data-testid="text-content"]')
  .should('have.class', 'text-left');
 
});

it('should test the button group', () => {
  cy.get('[data-testid="button-group"]').should('exist').click();
  cy.get('[data-testid="input-label"]').should('exist').clear().type('New Button Label', { delay: 0 });
  cy.get('[data-testid="text-button"]').should('have.text', 'New Button Label');
  cy.get('[data-testid="input-link"]').should('exist').clear().type('https://www.google.com', { delay: 0 });
  cy.get('[data-testid="text-button"]')
  .should('have.attr', 'href', 'https://www.google.com');
  cy.get('[data-testid="outline-secondary"]').should('exist').click();
  cy.get('[data-testid="text-button"]').should('have.class', 'active:text-primary-900');
  cy.get('[data-testid="outline-primary"]').should('exist').click();
  cy.get('[data-testid="text-button"]').should('have.class', 'active:bg-primary-700');
});

});
