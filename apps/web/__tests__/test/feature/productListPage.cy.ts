import { paths } from '../../../app/utils/paths';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';

const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Product List Page', function () {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ enableSingleProductUrlScheme: false });
    cy.visitAndHydrate(paths.home);
  });
  it('[smoke] User should be able to see the products as list and grid', () => {
    homePage.goToCategory();

    // ASSERT - list view can be as grid view
    productListPage.assertGridView();
  });

  it('Should have correct path on product card', () => {
    homePage.goToCategory();

    productListPage.assertProductCardPath('coupon_141_1072');
  });

  describe('Callisto URL Scheme', () => {
    beforeEach(() => {
      cy.clearConfig();
      cy.setConfig({ enableSingleProductUrlScheme: true });
      cy.visitAndHydrate(paths.home);
    });

    it('should have correct path on product card with callisto url scheme enabled', () => {
      homePage.goToCategory();
      productListPage.assertProductCardPath('coupon/a-141');
    });
  });
});
