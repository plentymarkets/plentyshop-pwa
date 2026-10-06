import { paths } from '~/utils/paths.ts';
import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { TEST_SYSTEM_DOMAIN } from '~~/cypress.config.ts';

const languageSelect = new LanguageSelectObject();
const cookieBar = new CookieBarObject();

const checkSeoLinks = (expected: { canonical: string; xDefault: string; de: string; en: string }) => {
  cy.get('head link[rel="canonical"]').should('have.attr', 'href', `${TEST_SYSTEM_DOMAIN}${expected.canonical}`);
  cy.get('head link[rel="alternate"][hreflang="x-default"]').should(
    'have.attr',
    'href',
    `${TEST_SYSTEM_DOMAIN}${expected.xDefault}`,
  );
  cy.get('head link[rel="alternate"][hreflang="de"]').should(
    'have.attr',
    'href',
    `${TEST_SYSTEM_DOMAIN}${expected.de}`,
  );
  cy.get('head link[rel="alternate"][hreflang="en"]').should(
    'have.attr',
    'href',
    `${TEST_SYSTEM_DOMAIN}${expected.en}`,
  );
};

describe('SEO: Canonicals & Alternates', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ enableSingleProductUrlScheme: false });

    cy.intercept('/plentysystems/getCategoryTree').as('getCategoryTree');
    cy.intercept('/plentysystems/getFacet').as('getFacet');
  });

  it('should set correct canonical, alternate and x-default links while navigating through the shop', () => {
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
    checkSeoLinks({ canonical: '/', xDefault: '/', de: '/de', en: '/' });

    cy.contains('[data-testid="category-button"]', 'Living Room').click();
    cy.wait('@getFacet');
    cy.getByTestId('category-page-content').should('be.visible');
    checkSeoLinks({
      canonical: '/living-room',
      xDefault: '/living-room',
      de: '/de/wohnzimmer',
      en: '/living-room',
    });

    cy.getByTestId('category-tree-item').first().click();
    cy.wait('@getFacet');
    checkSeoLinks({
      canonical: '/living-room/item-package',
      xDefault: '/living-room/item-package',
      de: '/de/wohnzimmer/artikelpaket',
      en: '/living-room/item-package',
    });

    languageSelect.openModal().changeLanguage('de');
    cy.wait('@getFacet');
    checkSeoLinks({
      canonical: '/de/wohnzimmer/artikelpaket',
      xDefault: '/living-room/item-package',
      de: '/de/wohnzimmer/artikelpaket',
      en: '/living-room/item-package',
    });

    cy.visitAndHydrate(paths.cart);
    checkSeoLinks({ canonical: '/cart', xDefault: '/cart', de: '/de/cart', en: '/cart' });

    cy.visitAndHydrate(paths.home);
    checkSeoLinks({ canonical: '/', xDefault: '/', de: '/de', en: '/' });
  });

  it('should set correct prev/next meta links on paginated category pages', () => {
    cy.visitAndHydrate('/living-room?itemsPerPage=1&page=1');
    cy.get('head link[rel="prev"]').should('not.exist');
    cy.get('head link[rel="next"]').should(
      'have.attr',
      'href',
      `${TEST_SYSTEM_DOMAIN}/living-room?itemsPerPage=1&page=2`,
    );

    cy.visitAndHydrate('/living-room?itemsPerPage=1&page=2');
    cy.get('head link[rel="prev"]').should('have.attr', 'href', `${TEST_SYSTEM_DOMAIN}/living-room?itemsPerPage=1`);
    cy.get('head link[rel="next"]').should(
      'have.attr',
      'href',
      `${TEST_SYSTEM_DOMAIN}/living-room?itemsPerPage=1&page=3`,
    );

    cy.visitAndHydrate('/living-room?itemsPerPage=9999&page=2');
    cy.get('head link[rel="prev"]').should('have.attr', 'href', `${TEST_SYSTEM_DOMAIN}/living-room?itemsPerPage=9999`);
    cy.get('head link[rel="next"]').should('not.exist');
  });
});
