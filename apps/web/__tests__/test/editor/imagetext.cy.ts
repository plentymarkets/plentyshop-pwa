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

    // cy.get('body').then(($body) => {
    //     if ($body.find('[data-testid="image-text-form"]').length > 0) {
    //       cy.log('✅ Form is present');
    //     } else {
    //       cy.log('❌ Form is missing');
    //     }
    //   });
    // cy.get('[data-testid="input-pre-title"]', { timeout: 3000 }).clear({ force: true }).type('New Pre title', { delay: 0, force: true });
    // cy.get('[data-testid="input-title"]', { timeout: 3000 }).clear({ force: true }).type('New title', { delay: 0, force: true });
    // cy.get('[data-testid="input-sub-title"]', { timeout: 3000 }).clear({ force: true }).type('New sub title', { delay: 0, force: true });
    // cy.get('[data-testid="textarea-html"]', { timeout: 3000 }).clear({ force: true }).type('New Text Area Content', { delay: 0, force: true });

    // cy.get('[data-testid="imagetext"]', { timeout: 3000 }).scrollIntoView().should('exist');

    // cy.get('[data-testid="imagetext"]', { timeout: 3000 }).within(() => {
    // cy.get('[data-testid="text-pretitle"]', { timeout: 3000 }).should('have.text', 'New Pre title');
    // cy.get('[data-testid="text-title"]', { timeout: 3000 }).should('have.text', 'New title');
    // cy.get('[data-testid="text-subtitle"]', { timeout: 3000 }).should('have.text', 'New sub title');
    // cy.get('[data-testid="text-html"]', { timeout: 3000 }).should('have.text', 'New Text Area Content');

    //   });

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
      
 
});

});
