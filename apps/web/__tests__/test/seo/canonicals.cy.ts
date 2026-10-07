import { paths } from '../../../app/utils/paths';
import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { TEST_SYSTEM_DOMAIN } from '../../support/variables.ts';
import { CartPageObject } from '../../support/pageObjects/CartPageObject.ts';
import { ProductListPageObject } from '../..//support/pageObjects/ProductListPageObject.ts';

const languageSelect = new LanguageSelectObject();
const cookieBar = new CookieBarObject();
const cart = new CartPageObject();
const productListPage = new ProductListPageObject();

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

    productListPage.goToProduct();
    checkSeoLinks({
      canonical: '/de/wohnzimmer/sessel-hocker/artikelpaket-4-x-esszimmerstuhl-juicyorange_137_1068',
      xDefault: '/living-room/item-package/4-x-dining-room-chair-juicyorange-item-bundle_137_1068',
      de: '/de/wohnzimmer/sessel-hocker/artikelpaket-4-x-esszimmerstuhl-juicyorange_137_1068',
      en: '/living-room/item-package/4-x-dining-room-chair-juicyorange-item-bundle_137_1068',
    });

    cart.openCart();
    checkSeoLinks({ canonical: '/de/cart', xDefault: '/cart', de: '/de/cart', en: '/cart' });

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

  it('should clear prev/next meta links when navigating client-side from a paginated category to a static page', () => {
    cy.visitAndHydrate('/living-room?itemsPerPage=1&page=2');
    cookieBar.acceptAll();
    cy.get('head link[rel="prev"]').should('have.attr', 'href', `${TEST_SYSTEM_DOMAIN}/living-room?itemsPerPage=1`);
    cy.get('head link[rel="next"]').should(
      'have.attr',
      'href',
      `${TEST_SYSTEM_DOMAIN}/living-room?itemsPerPage=1&page=3`,
    );

    cart.openCart();
    checkSeoLinks({ canonical: '/cart', xDefault: '/cart', de: '/de/cart', en: '/cart' });
    cy.get('head link[rel="prev"]').should('not.exist');
    cy.get('head link[rel="next"]').should('not.exist');
  });
});
