import { PageObject } from './PageObject';

export class RecommendedProductsObject extends PageObject {
  checkIsRecommendedBlockIsVisible = () => {
    cy.getByTestId('recommended-block').should('be.visible');

    return this;
  };

  clickOnRecommendedBlockEditButton = () => {
    cy.getByTestId('recommended-block')
      .closest('[data-testid="block-wrapper"]')
      .find('[data-testid="open-editor-button"]')
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

  typeInRecommendedForm = (field: string, value: string) => {
    cy.getByTestId(`recommended-form-${field}`).clear().type(value);

    return this;
  };

  changeSelectedCategory = (categoryName: string) => {
    cy.getByTestId('recommended-form-categories').should('exist').click();
    cy.get('.multiselect__content-wrapper').contains(categoryName).click();
    cy.wait('@getFacet');

    return this;
  };

  checkIfRecommendedBlockHasText = (field: string, text: string) => {
    cy.getByTestId('recommended-block').find(`[data-testid="text-${field}"]`).last().should('have.text', text);

    return this;
  };

  changeTextAlinment = (value: string) => {
    cy.getByTestId(`recommended-form-text-align-${value}`).should('exist').click();

    return this;
  };

  changeColor = (value: string) => {
    cy.getByTestId(`recommended-form-color`).clear().type(value);

    return this;
  };

  checkClassOnRecommendedBlock = (className: string) => {
    cy.getByTestId('recommended-block').should('have.class', className);

    return this;
  };

  checkStyleOnRecommendedBlock = () => {
    cy.getByTestId('recommended-block')
      .find(`[data-testid="text-title"]`)
      .last()
      .should('have.css', 'color', 'rgb(0, 255, 0)');

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
