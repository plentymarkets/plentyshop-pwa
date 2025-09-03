import { paths } from '../../../utils/paths';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';

const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
});

describe.skip('Smoke: Product List Page', function () {
  it('[smoke] User should be able to see the products as list and grid', () => {
    homePage.goToCategory();

    // ASSERT - list view can be as grid view
    productListPage.assertGridView();
  });
});
