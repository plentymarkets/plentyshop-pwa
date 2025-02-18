import { paths } from '../../../utils/paths';

describe('PWA Cookie Test', () => {
  const setPwaCookie = (value: string) => {
    cy.setCookie('pwa', value);
  };

  const checkPwaCookieExists = () => {
    cy.getCookie('pwa')
      .should('exist')
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
    setPwaCookie('1');
    cy.reload();
    checkPwaCookieExists();
    checkToolbarVisibility(true);
  });

  it('should remove the PWA cookie and verify it is gone', () => {
    cy.clearCookie('pwa');
    cy.reload();
    cy.getCookie('pwa').should('not.exist');
    checkToolbarVisibility(false);
  });
});
