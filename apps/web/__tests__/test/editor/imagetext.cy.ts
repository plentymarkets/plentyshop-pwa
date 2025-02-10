import { paths } from '../../../utils/paths';

describe('EditMode', () => {

  beforeEach(() => {
    cy.visitAndHydrate(paths.home);

  });

  it('should test image text', () => {
    cy.get('[data-testid="open-editor-button"]').eq(3).click().should('exist');
    cy.wait(1000);
    cy.get('[data-testid="image-text-form"]').should('exist');
    cy.get('[data-testid="text-group"]').should('exist').click();

    const inputs = [
        { selector: 'input-pre-title', text: 'New Pre title' },
        { selector: 'input-title', text: 'New title' },
        { selector: 'input-sub-title', text: 'New sub title' },
        { selector: 'textarea-html', text: 'New Text Area Content' }
      ];
      
      inputs.forEach(({ selector, text }) => {
        cy.get(`[data-testid="${selector}"]`)
          .should('exist')
          .clear({ force: true })
          .type(text, { delay: 0, force: true });
      });

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
      
 
});

});
