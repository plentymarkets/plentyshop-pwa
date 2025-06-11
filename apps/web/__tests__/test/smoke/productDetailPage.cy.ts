import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';
import { paths } from '../../../utils/paths';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const productDetailPage = new ProductDetailPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Product Detail Page', () => {
  it('[smoke] Open product page and check displayed data', () => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    homePage.goToCategory();
    productListPage.goToProduct();

    productDetailPage.displayCheck();
    productDetailPage.assertModernImageFormat();
  });
});
