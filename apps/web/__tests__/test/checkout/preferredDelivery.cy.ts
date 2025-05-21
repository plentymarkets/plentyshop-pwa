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
    cy.request('POST', 'http://localhost:8181/plentysystems/doAddCartItem', {"productId":1072,"quantity":1});

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm({ country: '7', zipCode: '1234' });
    preferredDeliveryObject.shouldNotShowPreferredDelivery();
  });

  it('should render when shipping country is Germany', () => {
    cy.request('POST', 'http://localhost:8181/plentysystems/doAddCartItem', {"productId":1072,"quantity":1});

    cart.openCart();
    checkout
      .goToCheckout()
      .goToGuestCheckout()
      .fillContactInformationForm()
      .fillShippingAddressForm({ country: '1', zipCode: '12345' });
    preferredDeliveryObject.shouldShowPreferredDelivery();
  });
});
