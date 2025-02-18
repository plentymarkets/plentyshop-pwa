import { paths } from '../../../utils/paths';

describe('PWA Cookie Test', () => {

  const setPwaCookie = (value: string) => {
    cy.setCookie('pwa', value);
  };

  const checkPwaCookieExists = () => {
    cy.getCookie('pwa').should('exist')
      .then((cookie) => {
        const message = cookie ? 'Cookie exists.' : 'Cookie does not exist.';
        cy.log(message);
        assert.isNotNull(cookie, 'Cookie should not be null');
        assert.isNotEmpty(cookie?.value, 'Cookie value should not be empty');
      });
  };
  const checkToolbarVisibility = (shouldBeVisible: boolean) => {
    if (shouldBeVisible) {
      cy.get('[data-testid="edit-mode-toolbar"]').should('be.visible');
    } else {
      cy.get('[data-testid="edit-mode-toolbar"]').should('not.exist');
    }
  };

  beforeEach(() => {
    cy.visit(paths.home);
  });

  it('should set and check if the PWA cookie exists', () => {
    setPwaCookie('1'); // Set the cookie to simulate PWA state
    cy.reload(); // Reload the page to apply cookie changes
    checkPwaCookieExists(); // Check existence and value of cookie
    checkToolbarVisibility(true); // Check that the toolbar is visible
  });

  it('should remove the PWA cookie and verify it is gone', () => {
    cy.clearCookie('pwa'); // Remove the cookie
    cy.reload(); // Reload to ensure the state is updated
    cy.getCookie('pwa').should('not.exist'); // Verify cookie is removed
    checkToolbarVisibility(false); // Check that the toolbar is not visible
  });

});