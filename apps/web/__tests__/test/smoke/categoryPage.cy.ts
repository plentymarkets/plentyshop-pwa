import { CategoryPageObject } from '../../support/pageObjects/CategoryObject';

const category = new CategoryPageObject();

describe('Smoke: Category Page', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.setCookie('consent-cookie', '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}')
  });

  it('[smoke] Category filters should trigger a product data reload', () => {
    cy.setCookie('vsf-locale', 'en');
    // We should configure the system so that the first category is set up with filters.
    // This way we are independet from the language and the url.
    cy.visitAndHydrate('/living-room');

    category.filterClickShouldReloadCategory();
  })

  it('[smoke] Category should load DE SSR on first visit where there are no browser cookies', () => {
    cy.visitAndHydrate('/de/wohnzimmer');
  })
});
