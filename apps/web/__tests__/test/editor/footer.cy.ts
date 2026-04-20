import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

describe('Footer Block', () => {
  const cookieBar = new CookieBarObject();
  const isFlagOn = Cypress.env('ENABLE_CONTRACT_WITHDRAWAL_BUTTON') === '1';

  const getFooter = () => cy.getByTestId('footer');

  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();

    cy.setConfig({
      isPreview: false,
    });

    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('should render footer', () => {
    getFooter().should('be.visible');
  });

  it('should render the correct cancellation action depending on feature flag', () => {
    getFooter().within(() => {
      if (isFlagOn) {
        cy.getByTestId('footer-cancellation-button')
          .should('exist')
          .and('contain.text', 'Withdraw from contract here')
          .and('have.attr', 'href')
          .and('include', paths.cancellationForm);

        cy.contains('Cancellation Form').should('not.exist');
      } else {
        cy.getByTestId('footer-cancellation-button').should('not.exist');
        cy.get(`a[href*="${paths.cancellationForm}"]`).should('exist');
      }
    });
  });

  it('should render cancellation rights before the withdrawal button when feature flag is ON', () => {
    if (!isFlagOn) return;

    getFooter().then(($footer) => {
      const text = $footer.text();

      expect(text.indexOf('Cancellation Rights')).to.be.lessThan(text.indexOf('Withdraw from contract here'));
    });
  });

  it('should apply footer colors', () => {
    getFooter()
      .should('have.css', 'background-color', 'rgb(207, 228, 236)')
      .and('have.css', 'color', 'rgb(28, 28, 28)');
  });

  it('should navigate to cancellation form when clicking the withdrawal button if feature flag is ON', () => {
    if (!isFlagOn) return;

    cy.getByTestId('footer-cancellation-button').should('have.attr', 'href').and('include', paths.cancellationForm);
  });
});
