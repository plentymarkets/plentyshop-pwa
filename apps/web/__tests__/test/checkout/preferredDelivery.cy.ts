import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { paths } from '../../../utils/paths';
import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { CartPageObject } from '../../support/pageObjects/CartPageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { PreferredDeliveryObject } from '../../support/pageObjects/PreferredDeliveryObject';

const checkout = new CheckoutPageObject();
const cart = new CartPageObject();
const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();
const preferredDeliveryObject = new PreferredDeliveryObject();

beforeEach(() => {
  cy.clearCookies();
  cy.visitAndHydrate(paths.home);
});

describe('Preferred Delivery', () => {
  it('should not render when shipping country is not Germany', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();
    checkout.goToCheckout().goToGuestCheckout().fillContactInformationForm().fillShippingAddressForm({ country: '7' });
    preferredDeliveryObject.shouldNotShowPreferredDelivery();
  });

  it('should render when shipping country is Germany', () => {
    homePage.goToCategory();
    productListPage.addToCart();
    cart.openCart();
    checkout.goToCheckout().goToGuestCheckout().fillContactInformationForm().fillShippingAddressForm({ country: '1' });
    preferredDeliveryObject.shouldShowPreferredDelivery();
  });
});
