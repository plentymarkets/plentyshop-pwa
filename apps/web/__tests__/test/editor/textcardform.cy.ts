import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { paths } from '../../../app/utils/paths';

describe('Text Card Block Form', () => {
  const openSettingsForTextCardBlock = () => {
    cy.get('[data-testid="TextCard-open-editor-button"]').should('have.length.at.least', 2);
    cy.get('[data-testid="TextCard-open-editor-button"]').first().should('exist').click({ force: true });
    cy.wait(1000);
  };

  const openTextGroup = () => {
    cy.get('[data-testid="open-text-settings"]').should('exist').click();
  };

  const editText = () => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .wait(200)
      .type('{selectall}{del}', { delay: 50 })
      .type('Edited HTML Description', { delay: 0 });

    cy.get('[data-testid^="text-html"]').filter(':contains("Edited HTML Description")').should('exist');
  };

  const changeTextColor = () => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .type('{selectall}');

    cy.get('[data-testid="rte-font-color"]').filter(':visible').first().click();

    cy.get('#HEX').clear().type('#790C0C{enter}', { delay: 0 });

    cy.get('[data-testid="rte-font-color"]').filter(':visible').first().click();

    cy.get('[data-testid^="text-html"]')
      .filter(':contains("Edited HTML Description")')
      .find('span')
      .should('have.css', 'color', 'rgb(121, 12, 12)');
  };

  const changeTextAlignment = () => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .type('{selectall}');

    cy.get('[data-testid="rte-align-center"]').filter(':visible').click();
    cy.get('[data-testid^="text-html"]')
      .filter(':contains("Edited HTML Description")')
      .find('p')
      .first()
      .should('have.css', 'text-align', 'center');

    cy.get('[data-testid="rte-align-right"]').filter(':visible').click();
    cy.get('[data-testid^="text-html"]')
      .filter(':contains("Edited HTML Description")')
      .find('p')
      .first()
      .should('have.css', 'text-align', 'right');

    cy.get('[data-testid="rte-align-left"]').filter(':visible').click();
    cy.get('[data-testid^="text-html"]')
      .filter(':contains("Edited HTML Description")')
      .find('p')
      .first()
      .should('have.css', 'text-align', 'left');
  };

  const openButtonGroup = () => {
    cy.get('[data-testid="button-settings"]').should('exist').click();
  };

  const changeButtonLink = () => {
    cy.get('[data-testid="input-button-link"]').should('exist').clear().type('https://www.google.com', { delay: 0 });
    cy.get('[data-testid="text-button"]').should('have.attr', 'href', 'https://www.google.com');
  };

  const changeButtonLabel = () => {
    cy.get('[data-testid="input-button-label"]').should('exist').clear().type('New Button Label', { delay: 0 });
    cy.get('[data-testid="text-button"]').first().should('have.text', 'New Button Label');
  };

  const changeButtonVariants = () => {
    cy.get('[data-testid="button-outline-secondary"]').should('exist').click();
    cy.get('[data-testid="text-button"]').should('have.class', 'active:text-primary-900');
    cy.get('[data-testid="button-outline-primary"]').should('exist').click();
    cy.get('[data-testid="text-button"]').should('have.class', 'active:bg-primary-700');
  };

  const cookieBar = new CookieBarObject();

  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    openSettingsForTextCardBlock();
  });

  it('should change the text settings', () => {
    openTextGroup();
    editText();
    changeTextColor();
    changeTextAlignment();
  });

  it('should change the button settings', () => {
    openButtonGroup();
    changeButtonLink();
    changeButtonLabel();
    changeButtonVariants();
  });
});
