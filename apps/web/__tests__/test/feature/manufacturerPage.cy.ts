import { ProductManufacturerPageObject } from '../../support/pageObjects/ProductManufacturerPageObject';
import { paths } from '../../../app/utils/paths';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const productManufacturerPage = new ProductManufacturerPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Product Manufacturer Page', () => {
  it('[smoke] Open product page and check manufacturer information si available', () => {
    cy.clearCookies();
    cy.visitAndHydrate(paths.home);
    homePage.goToCategory();
    productListPage.goToProduct();

    productManufacturerPage.displayCheck();
  });
});
