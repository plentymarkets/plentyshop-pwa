import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';
import { paths } from '../../../utils/paths';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const productDetailPage = new ProductDetailPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Product Detail Page', () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it('[smoke] Open product page and check displayed data', () => {
    cy.visitAndHydrate(paths.home);
    homePage.goToCategory();
    productListPage.goToProduct();

    productDetailPage.displayCheck();
    productDetailPage.assertModernImageFormat();
  });

  describe('should validate product url params', () => {
    it('should succeed to validate product url params with one valid params', () => {
      cy.request({
        url: '/backpack-gaia_164',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should succeed to validate product url params with 2 valid params', () => {
      cy.request({
        url: '/backpack-gaia_164_1107',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should fail to validate product url params with string', () => {
      cy.request({
        url: '/backpack-gaia_164_notallowdstring',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to validate product url params with string', () => {
      cy.request({
        url: '/backpack-gaia_notallowdstring_notallowdstring',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to validate product url with 3 params', () => {
      cy.request({
        url: '/backpack-gaia_1234_1234_1234',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to validate product url with 1 string param', () => {
      cy.request({
        url: '/my-category/testurl_param',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
