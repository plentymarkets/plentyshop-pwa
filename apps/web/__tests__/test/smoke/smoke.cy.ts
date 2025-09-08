import { paths } from '../../../utils/paths';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { SearchObject } from '../../support/pageObjects/SearchObject';
import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';

const cartPage = new CartPageObject();
const checkoutPage = new CheckoutPageObject();
const homePage = new HomePageObject();
const searchPage = new SearchObject();
const productDetailPage = new ProductDetailPageObject();

const text_de = 'Wohnzimmer';
const text_en = 'Living Room';
const productToSearch = 'headphones';

describe('Smoke Tests', () => {
  it('should search for and purchase a product in English', () => {
    cy.visitAndHydrate(paths.home);
    homePage.checkLanguage(text_en).topToolbarShouldNotExist().sideToolbarShouldNotExist().blockActionsShouldNotExist();

    searchPage.searchFor(productToSearch).goToProduct();

    productDetailPage.assertProductDetailPageElements().addToCart(2);

    cartPage.openCartViaQuickCheckout().decreaseCartItemQuantity().summaryItems('Items: 1');

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

  it('should register and purchase a product in German', () => {
    cy.visitAndHydrate(paths.home + 'de');
    homePage.checkLanguage(text_de);
    homePage.topToolbarShouldNotExist();
    homePage.sideToolbarShouldNotExist();
    homePage.blockActionsShouldNotExist();
  });
});
