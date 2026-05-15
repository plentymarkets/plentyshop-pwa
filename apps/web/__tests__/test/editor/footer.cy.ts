import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

describe('Footer Block', () => {
  const cookieBar = new CookieBarObject();

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

  it('should render the correct cancellation action', () => {
    getFooter().within(() => {
      cy.getByTestId('text-button')
        .should('exist')
        .and('contain.text', 'Withdraw from contract here')
        .and('have.attr', 'href')
        .and('include', paths.cancellationForm);

      cy.contains('Cancellation Form').should('not.exist');
    });
  });

  it('should apply footer colors', () => {
    getFooter()
      .should('have.css', 'background-color', 'rgb(207, 228, 236)')
      .and('have.css', 'color', 'rgb(28, 28, 28)');
  });

  it('should navigate to cancellation form when clicking the withdrawal button', () => {
    getFooter().within(() => {
      cy.getByTestId('text-button').should('have.attr', 'href').and('include', paths.cancellationForm);
    });
  });
});
