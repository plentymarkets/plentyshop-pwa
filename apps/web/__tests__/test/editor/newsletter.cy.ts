import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../utils/paths';

describe('Newsletter Block Form', () => {
  const checkIfNewsletterBlockIsVisible = () => {
    cy.getByTestId('newsletter-block').should('be.visible');
  };

  const clickOnNewsletterBlockEditButton = () => {
    cy.getByTestId('newsletter-block')
      .closest('[data-testid="block-wrapper"]')
      .find('[data-testid="open-editor-button"]')
      .click();
  };

  const typeInNewsletterForm = (field: string, value: string) => {
    cy.getByTestId(`newsletter-form-${field}`).clear().type(value);
  };

  const checkIfNewsletterBlockHasText = (field: string, text: string) => {
    cy.getByTestId(`newsletter-${field}`).should('have.text', text);
  };

  const removeNameInputFromForm = () => {
    cy.getByTestId('newsletter-display-name').should('exist');
    cy.getByTestId('newsletter-form-display-name').click();
    cy.getByTestId('newsletter-display-name').should('not.exist');
  };

  const nameInputIsRequired = (state: boolean) => {
    cy.getByTestId('newsletter-display-name')
      .find('input[placeholder]')
      .eq(0)
      .invoke('attr', 'placeholder')
      .should(state ? 'contain' : 'not.contain', '**');
    cy.getByTestId('newsletter-display-name')
      .find('input[placeholder]')
      .eq(1)
      .invoke('attr', 'placeholder')
      .should(state ? 'contain' : 'not.contain', '**');
  };

  const changeBackgroundColor = () => {
    typeInNewsletterForm('background-color', '#00ff00');
    cy.getByTestId('newsletter-block').should('have.css', 'background-color', 'rgb(0, 255, 0)');
  };

  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.setCookie('vsf-locale', 'en');
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    clickOnNewsletterBlockEditButton();
  });

  it('should ensure newsletter block is visible', () => {
    checkIfNewsletterBlockIsVisible();
  });

  it('should change the title on newsletter form', () => {
    typeInNewsletterForm('title', 'New title');
    checkIfNewsletterBlockHasText('title', 'New title');
  });

  it('should change the description on newsletter form', () => {
    typeInNewsletterForm('description', 'New description');
    checkIfNewsletterBlockHasText('description', 'New description');
  });

  it('should change the display name on newsletter form', () => {
    removeNameInputFromForm();
  });

  it('should change the mandatory name on newsletter form', () => {
    nameInputIsRequired(false);
    cy.getByTestId('newsletter-form-mandatory-name').click();
    nameInputIsRequired(true);
  });

  it('should change the button text on newsletter form', () => {
    typeInNewsletterForm('button-text', 'New button text');
    checkIfNewsletterBlockHasText('button', 'New button text');
  });

  it('should change the background color on newsletter form', () => {
    changeBackgroundColor();
  });
});
