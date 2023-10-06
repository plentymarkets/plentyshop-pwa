import { CategoryPageObject } from '../../support/pageObjects/CategoryObject';

const category = new CategoryPageObject();

describe('Smoke: Category Page', () => {
  it('[smoke] Category filters should trigger a product data reload', () => {
    // We should configure the system so that the first category is set up with filters. 
    // This way we are independet from the language and the url.
    cy.visitAndHydrate('/c/living-room');

    category.filterClickShouldReloadCategory;
  })
});
