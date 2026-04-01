import { PageObject } from './PageObject';

export class RecommendedProductsObject extends PageObject {
  checkIsRecommendedBlockIsVisible = () => {
    cy.getByTestId('recommended-block').first().scrollIntoView({ duration: 500 });
    cy.wait(1000);
    cy.getByTestId('recommended-block').should('be.visible');

    return this;
  };

  clickOnRecommendedBlockEditButton = () => {
    cy.getByTestId('recommended-block')
      .closest('[data-testid="block-wrapper"]')
      .find('[data-testid="ProductRecommendedProducts-open-editor-button"]')
      .last()
      .click();

    return this;
  };

  openTextFormSection = () => {
    cy.getByTestId('open-recommended-products-form-texts').should('exist').click();

    return this;
  };

  openSourceFormSection = () => {
    cy.getByTestId('open-recommended-products-form-source').should('exist').click();

    return this;
  };

  typeInRecommendedForm = (value: string) => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .wait(200)
      .type('{selectall}{del}', { delay: 50 })
      .type(value, { delay: 0 });
    return this;
  };

  changeSelectedCategory = (categoryName: string) => {
    cy.getByTestId('recommended-form-categories').should('exist').click();
    cy.get('.multiselect__content-wrapper').contains(categoryName).click();
    cy.wait('@getFacet');
    return this;
  };

  checkIfRecommendedBlockHasText = (text: string) => {
    cy.get('[data-testid^="text-html"]')
      .filter(':contains("' + text + '")')
      .should('exist');
    return this;
  };

  changeTextColor = (hex: string) => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .type('{selectall}');

    cy.get('[data-testid="rte-font-color"]').filter(':visible').first().click();

    cy.get('#HEX').clear().type(`#${hex}{enter}`, { delay: 0 });

    cy.get('[data-testid="rte-font-color"]').filter(':visible').first().click();

    return this;
  };

  checkTextColor = (color: string) => {
    cy.get('[data-testid^="text-html"]')
      .filter(':contains("New description")')
      .find('span')
      .should('have.css', 'color', color);

    return this;
  };

  changeTextAlignment = (align: string) => {
    cy.get('[data-testid="rte-editor"]')
      .filter(':visible')
      .find('[contenteditable="true"]')
      .click()
      .type('{selectall}');

    cy.get(`[data-testid="rte-align-${align}"]`).filter(':visible').click();

    cy.get('[data-testid^="text-html"]')
      .filter(':contains("New description")')
      .find('p')
      .first()
      .should('have.css', 'text-align', align);

    return this;
  };

  checkExpectedProductsInSlider = (expectedProducts: string[]) => {
    cy.getByTestId('product-slider')
      .last()
      .should('exist')
      .within(() => {
        expectedProducts.forEach((productName) => {
          cy.get('[data-testid="productcard-name"]').contains(productName).should('exist');
        });
      });

    return this;
  };
}
