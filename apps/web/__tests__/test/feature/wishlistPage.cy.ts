import { paths } from '../../../utils/paths';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { WishlistObject } from "../../support/pageObjects/WishlistObject";
import { CartPageObject } from "../../support/pageObjects/CartPageObject";
import {ProductDetailPageObject} from "../../support/pageObjects/ProductDetailPageObject";

const homePage = new HomePageObject();
const wishlist = new WishlistObject();
const cart = new CartPageObject();
const productListPage = new ProductListPageObject();
const productDetailPage = new ProductDetailPageObject();

beforeEach(() => {
  cy.intercept('/plentysystems/getWishlist').as('getWishlist');
  cy.intercept('/plentysystems/doAddWishlistItem').as('doAddWishlistItem');
  cy.intercept('/plentysystems/deleteWishlistItem').as('deleteWishlistItem');

  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.setCookie('consent-cookie', '{"Essentials":{"Session":true,"Consent":true,"Session2":true},"External Media":{"Session":false,"Consent":false,"Session2":false},"Functional":{"Session":false,"Consent":false,"Session2":false},"Marketing":{"Session":false,"Consent":false,"Session2":false}}')

  cy.visitAndHydrate(paths.home);
});


describe('Wishlist functionality check.', () => {
  it('Checks wishlist functionality from category.', () => {
    homePage.goToCategory();
    productListPage.assertGridView();

    wishlist
        .addWishlistItem()
        .openWishlist()
        .checkItemExistence()
        .addToCart();

    cart
        .openCart()
        .assertCartPreviewElements()

    homePage.goToCategory();
    wishlist
        .removeWishlistItem()
        .openWishlist()
        .checkEmptyPage()
  });

  it('Check wishlist functionality from product page.', () => {
    homePage.goToCategory();
    productListPage
        .assertGridView()
        .goToProduct();
    productDetailPage.displayCheck();

    wishlist
        .addWishlistItem()
        .openWishlist()
        .checkItemExistence()
        .removeWishlistItem()
        .checkEmptyPage()
  });
});
