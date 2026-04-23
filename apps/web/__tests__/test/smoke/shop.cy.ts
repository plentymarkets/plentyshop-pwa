import { paths } from '../../../app/utils/paths';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { SearchObject } from '../../support/pageObjects/SearchObject';
import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { HeaderBlockObject } from '../../support/pageObjects/HeaderBlockObject';
import { FooterBlockObject } from '../../support/pageObjects/FooterBlockObject';

const cartPage = new CartPageObject();
const checkoutPage = new CheckoutPageObject();
const homePage = new HomePageObject();
const searchPage = new SearchObject();
const productDetailPage = new ProductDetailPageObject();
const productListPage = new ProductListPageObject();
const headerBlock = new HeaderBlockObject();
const footerBlock = new FooterBlockObject();

const text_en = 'Living Room';
const productToSearch = 'headphones';

describe('Shop Smoke Tests', () => {
  it('global blocks render and persist across navigation', () => {
    cy.visitAndHydrate(paths.home);

    // prettier-ignore
    headerBlock
      .assertVisible()
      .assertNavigation()
      .assertActionButtons();

    // prettier-ignore
    footerBlock
      .assertVisible()
      .assertLinks();

    headerBlock.navigateToCategory();
    headerBlock.assertVisible();
    footerBlock.assertVisible();
  });

  it('purchase a product', () => {
    cy.visitAndHydrate(paths.home);

    // prettier-ignore
    homePage
      .checkLanguage(text_en)
      .safeModeBannerShouldNotExist()
      .topToolbarShouldNotExist()
      .sideToolbarShouldNotExist()
      .blockActionsShouldNotExist()
      .assertBlockTemplate()
      .goToCategory();

    // prettier-ignore
    productListPage
      .assertBlockTemplate()
      .assertGridView()
      .addToCart();

    // prettier-ignore
    searchPage
      .searchFor(productToSearch)
      .goToProduct();

    // prettier-ignore
    productDetailPage
      .assertProductDetailPageElements()
      .assertBlockTemplate()
      .assertProductStructuredDataExists()
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
