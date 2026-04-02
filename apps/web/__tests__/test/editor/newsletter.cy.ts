import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';

describe('Newsletter Block Form', () => {
  const checkIfNewsletterBlockIsVisible = () => {
    cy.getByTestId('newsletter-block').should('be.visible');
  };

  const clickOnNewsletterBlockEditButton = () => {
    cy.getByTestId('newsletter-block')
      .closest('[data-testid="block-wrapper"]')
      .find('[data-testid="NewsletterSubscribe-open-editor-button"]')
      .click();
  };

  const changeDescription = (value: string) => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .type('{selectall}{del}', { delay: 50 })
      .type(value, { delay: 0 });
  };

  const checkDescription = (text: string) => {
    cy.get('[data-testid="text-html-newsletter"]').should('contain.text', text);
  };

  const changeButtonText = (value: string) => {
    cy.get('[data-testid="newsletter-form-button-text"]').clear().type(value, { delay: 0 });
  };

  const checkButtonText = (text: string) => {
    cy.get('[data-testid="newsletter-button"]').should('have.text', text);
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
    cy.get('[data-testid="newsletter-form-background-color"]').clear().type('#00ff00', { delay: 0 });
    cy.getByTestId('newsletter-block').should('have.css', 'background-color', 'rgb(0, 255, 0)');
  };

  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    clickOnNewsletterBlockEditButton();
  });

  it('should ensure newsletter block is visible', () => {
    checkIfNewsletterBlockIsVisible();
  });

  it('should change the description on newsletter form', () => {
    changeDescription('New description');
    checkDescription('New description');
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
    changeButtonText('New button text');
    checkButtonText('New button text');
  });

  it('should change the background color on newsletter form', () => {
    changeBackgroundColor();
  });
});
