import { PageObject } from './PageObject';

export class CategorySettingsObject extends PageObject {
  checkDrawerVisible() {
    this.settingsDrawer.should('be.visible');
    return this;
  }

  toggleRecommendedSortingSection() {
    this.recommendedSortingSection.should('be.visible').click();
    return this;
  }

  toggleCategorySortingSection() {
    this.categorySortingSection.should('be.visible').click();
    return this;
  }

  toggleVariationPositionSection() {
    this.variationPositionSection.should('be.visible').click();
    return this;
  }

  checkSelectsExist() {
    this.sortingSelect('recommended-first-sorting-select').should('exist').as('firstSorting');
    this.sortingSelect('recommended-second-sorting-select').should('exist').as('secondSorting');
    this.sortingSelect('recommended-third-sorting-select').should('exist').as('thirdSorting');

    return this;
  }

  checkToggleExist() {
    cy.getByTestId('variation-position-toggle').should('exist');
    return this;
  }

  checkCategorySelectsExist() {
    this.sortingSelect('available-sorting-select').should('exist').as('availableSorting');
    this.sortingSelect('default-sorting-select').should('exist').as('defaultSorting');

    return this;
  }

  checkCategoryOptions() {
    const expectedAvailableSortingOptions = 19;
    const expectedSelectSortByOptions = 1;
    cy.get('@availableSorting')
      .click()
      .find('.multiselect__element')
      .should('have.length', expectedAvailableSortingOptions);

    cy.getByTestId('select-sort-by').find('option').should('have.length.of.at.least', expectedSelectSortByOptions);

    return this;
  }

  checkCorrectNumberOfSortingOptions() {
    const expectedOptionCount = 25;

    cy.get('@firstSorting').click();
    cy.get('@firstSorting').find('.multiselect__element').should('have.length', expectedOptionCount);

    return this;
  }

  closeDrawer() {
    this.closeButton.should('be.visible').click();
    return this;
  }

  checkDrawerNotVisible() {
    this.settingsDrawer.should('not.exist');
    return this;
  }

  checkTooltip(tooltip, textToContain) {
    cy.getByTestId(tooltip).trigger('mouseenter');
    cy.contains(textToContain).should('be.visible');
    return this;
  }

  get recommendedSortingSection() {
    return cy.getByTestId('recommended-sorting-section');
  }

  get categorySortingSection() {
    return cy.getByTestId('category-sorting-section');
  }

  get variationPositionSection() {
    return cy.getByTestId('variation-position-based-on-sales-section');
  }

  sortingSelect(sortingSelect) {
    return cy.getByTestId(sortingSelect);
  }

  get closeButton() {
    return cy.getByTestId('view-close');
  }

  get settingsDrawer() {
    return cy.getByTestId('site-settings-drawer');
  }
}
