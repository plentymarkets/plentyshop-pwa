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

    checkSelectsExist() {
        this.recommendedSortingSelect('recommended-first-sorting-select').should('exist').as('firstSorting');
        this.recommendedSortingSelect('recommended-second-sorting-select').should('exist').as('secondSorting');
        this.recommendedSortingSelect('recommended-third-sorting-select').should('exist').as('thirdSorting');

        return this;
    }

    checkCorrectNumberOfSortingOptions() {
        const expectedOptionCount = 25;

        cy.get('@firstSorting').click();
        cy.get('@firstSorting')
            .find('.multiselect__element')
            .should('have.length', expectedOptionCount);

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

    checkTooltip() {
        cy.getByTestId('first-option-tooltip').trigger('mouseover');
        cy.contains('First sorting option').should('be.visible');
        return this;
    }


    get recommendedSortingSection() {
        return cy.getByTestId('recommended-sorting-section');
    }

    recommendedSortingSelect(sortingSelect) {
        return cy.getByTestId(sortingSelect);
    }

    get closeButton() {
        return cy.getByTestId('view-close');
    }

    get settingsDrawer() {
        return cy.getByTestId('site-settings-drawer');
    }
}
