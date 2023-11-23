import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { paths } from '../../../utils/paths';

const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();

describe('Smoke: Cart Page', () => {
  it('[smoke] Add items to cart and display it', () => {
    cy.visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.addToCart()

    cart.openCart().checkCart();
  });
});
