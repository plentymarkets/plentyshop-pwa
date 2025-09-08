import { paths } from '../../../utils/paths';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { SearchObject } from '../../support/pageObjects/SearchObject';
import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';

const cartPage = new CartPageObject();
const checkoutPage = new CheckoutPageObject();
const homePage = new HomePageObject();
const searchPage = new SearchObject();
const productDetailPage = new ProductDetailPageObject();
const productListPage = new ProductListPageObject();

const text_en = 'Living Room';
const productToSearch = 'headphones';

describe('Smoke Tests', () => {
  it('purchase a product', () => {
    cy.visitAndHydrate(paths.home);

    // prettier-ignore
    homePage
      .checkLanguage(text_en)
      .topToolbarShouldNotExist()
      .sideToolbarShouldNotExist()
      .blockActionsShouldNotExist()
      .goToCategory();

    // prettier-ignore
    productListPage
      .assertGridView()
      .addToCart();

    // prettier-ignore
    searchPage
      .searchFor(productToSearch)
      .goToProduct();

    // prettier-ignore
    productDetailPage
      .assertProductDetailPageElements()
      .addToCart(2);

    // prettier-ignore
    cartPage
      .openCartViaQuickCheckout()
      .removeFirstItem()
      .decreaseCartItemQuantity()
      .summaryItems('Items: 1');

    checkoutPage
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm()
      .checkInvoice()
      .acceptTerms()
      .placeOrderButton()
      .displaySuccessPage();
  });
});
