import { paths } from '../../../utils/paths';

describe('EditMode', () => {

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);

  });

  it('should test image text', () => {
    cy.get('[data-testid="open-editor-button"]').should('have.length.at.least', 4); 

    cy.get('[data-testid="open-editor-button"]')
      .eq(3)
      .should('exist')
      .click({ force: true });
    cy.wait(1000);
    
    cy.get('[data-testid="image-text-form"]').should('exist');
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
      cy.get('[data-testid="imagetext"]').scrollIntoView().should('exist');
      cy.get('[data-testid="imagetext"]').within(() => {
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


      cy.get('[data-testid="color-picker"]').should('exist').clear().type('#790c0c');

      cy.get('[data-testid="text-content"]')
      .should('be.visible')
      .should('have.css', 'color', 'rgb(121, 12, 12)');


      cy.get('[data-testid="text-content"]').then(($el) => {
        cy.log('Computed color:', $el.css('color'));
      });
 
});

});
