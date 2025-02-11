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


      cy.get('[data-testid="color-picker"]').should('exist').clear().type('rgb(121, 12, 12)');
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

});
