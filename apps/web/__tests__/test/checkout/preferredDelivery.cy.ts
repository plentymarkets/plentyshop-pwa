import { CheckoutPageObject } from '../../support/pageObjects/CheckoutPageObject';
import { PreferredDeliveryObject } from '../../support/pageObjects/PreferredDeliveryObject';

const checkout = new CheckoutPageObject();
const preferredDeliveryObject = new PreferredDeliveryObject();

beforeEach(() => {
  cy.clearCookies().visitSmoke();
});

describe('Preferred Delivery', () => {
  it('should not render when shipping country is not Germany', () => {
    cy.addToCart();
    checkout.goToCheckoutPath().fillContactInformationForm().fillShippingAddressForm({ country: '7', zipCode: '1234' });
    preferredDeliveryObject.shouldNotShowPreferredDelivery();
  });

  it('should render when shipping country is Germany', () => {
    cy.addToCart();
    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .fillShippingAddressForm({ country: '1', zipCode: '12345' });
    preferredDeliveryObject.shouldShowPreferredDelivery();
  });

  it('should buy with preferred delivery', () => {
    cy.addToCart();
    checkout
      .goToCheckoutPath()
      .fillContactInformationForm()
      .fillShippingAddressForm({ country: '1', zipCode: '12345' });

    preferredDeliveryObject
      .checkPreferredDeliveryDayCheckbox()
      .fillPreferredDeliveryLocation('Test Location')
      .submitPreferredDeliveryForm();

    checkout.acceptTerms().placeOrderButton().displaySuccessPage();
  });
});
