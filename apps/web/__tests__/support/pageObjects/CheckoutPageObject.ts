import type { AddressFixtureOverride } from '~/__tests__/types';
import { PageObject } from './PageObject';
import { paths } from '../../../utils/paths';

export class CheckoutPageObject extends PageObject {
  get goToCheckoutButton() {
    return cy.getByTestId('checkout-button');
  }

  get goToGuestCheckoutButton() {
    return cy.getByTestId('guest-checkout-button');
  }

  get addContactInformationButton() {
    return cy.getByTestId('button').contains('Add contact information');
  }

  get addBillingAddressButton() {
    return cy.getByTestId('add-1-button');
  }

  get addShippingAddressButton() {
    return cy.getByTestId('button').contains('Add shipping address');
  }

  get shippingAddressForm() {
    return cy.getByTestId('shipping-address-form');
  }

  get billingAddressForm() {
    return cy.getByTestId('billing-address-form');
  }

  get contactInformationForm() {
    const input = cy.getByTestId('contact-information-form').find('input');
    input.clear();
    return input;
  }

  get saveShipping() {
    return cy.getByTestId('save-address-2');
  }

  get saveBilling() {
    return cy.getByTestId('save-address-1');
  }

  get contactInformationFormSaveButton() {
    return cy.getByTestId('contact-information-save-button');
  }

  get placeOrderButtons() {
    return cy.getByTestId('place-order-button');
  }

  get displaySuccessPages() {
    return cy.get('[data-testid="order-success-page"]', { timeout: 60000 });
  }

  get inputField() {
    return cy.getByTestId('contact-information-form').children('[type="email"]');
  }

  get modal() {
    return cy.getByTestId('checkout-edit-address-modal');
  }

  editBillingAddress() {
    cy.getByTestId('edit-address-1').click();
    return this;
  }

  get backButton() {
    return cy.getByTestId('checkout-back-button');
  }

  get thankYouBanner() {
    return cy.getByTestId('success-header');
  }

  get orderPaymentStatus() {
    return cy.getByTestId('order-payment-status');
  }

  get firstNameInput() {
    return cy.getByTestId('input').find('input[name="firstName"]');
  }

  get lastNameInput() {
    return cy.getByTestId('input').find('input[name="lastName"]');
  }

  get countrySelect() {
    return cy.getByTestId('select').find('select[name="country"]');
  }

  get streetNameInput() {
    return cy.getByTestId('input').find('input[name="streetName"]');
  }

  get streetNumberInput() {
    return cy.getByTestId('input').find('input[name="streetNumber"]');
  }

  get cityInput() {
    return cy.getByTestId('input').find('input[name="city"]');
  }

  get stateSelect() {
    return cy.getByTestId('select').find('select[name="state"]');
  }

  get postalCodeInput() {
    return cy.getByTestId('input').find('input[name="zipCode"]');
  }

  get useShippingAsBilling() {
    return cy.getByTestId('use-shipping-as-billing');
  }

  get shippingAsBillingText() {
    return cy.getByTestId('address-info-text-1');
  }

  get billingAddressSelect() {
    return cy.getByTestId('address-select-1');
  }

  get shippingAddressSelect() {
    return cy.getByTestId('address-select-2');
  }

  goToGuestCheckout() {
    this.goToGuestCheckoutButton.click();
    return this;
  }

  goToCheckout() {
    this.goToCheckoutButton.click();
    return this;
  }

  goToCheckoutPath() {
    cy.visitAndHydrate(paths.checkout);
    return this;
  }

  goBack() {
    this.backButton.click();
    return this;
  }

  addContactInformation() {
    this.addContactInformationButton.eq(0).should('have.text', 'Add contact information');
    cy.waitUntilElementInDOM(() => {
      this.addContactInformationButton.click();
      return this.modal;
    });
    this.modal.should('be.visible');
    return this;
  }

  addBillingAddress() {
    this.addBillingAddressButton.eq(0).click();
    this.modal.should('be.visible');

    return this;
  }

  addShippingAddress() {
    this.addShippingAddressButton.eq(0).should('have.text', 'Add shipping address').click();
    this.modal.should('be.visible');
  }

  placeOrderButton() {
    cy.intercept('/plentysystems/doAdditionalInformation')
      .as('doAdditionalInformation')
      .intercept('/plentysystems/doPreparePayment')
      .as('doPreparePayment');

    this.placeOrderButtons.click();

    cy.wait(['@doAdditionalInformation', '@doPreparePayment'], { timeout: 20000 });

    return this;
  }

  placeCreditCartOrder() {
    cy.intercept('/plentysystems/doAdditionalInformation').as('doAdditionalInformation');
    this.placeOrderButtons.click();
    cy.wait('@doAdditionalInformation');
    return this;
  }

  displaySuccessPage() {
    this.displaySuccessPages.should('be.visible');
    this.thankYouBanner.should('be.visible');
    return this;
  }

  displayFullyPaid() {
    this.orderPaymentStatus.contains('Paid');
    return this;
  }

  fillContactInformationForm() {
    cy.intercept('/plentysystems/doLoginAsGuest').as('loginAsGuest');
    cy.getFixture('addressForm').then(() => {
      const uniqueEmail = `test.order${new Date().getTime()}@plentymarkets.com`;
      this.contactInformationForm.type(uniqueEmail).blur();
    });
    cy.wait('@loginAsGuest', { timeout: 10000 });

    return this;
  }

  acceptTerms() {
    cy.getByTestId('checkout-terms-checkbox').check();

    return this;
  }

  fillShippingAddressForm(fixtureOverride?: AddressFixtureOverride) {
    cy.intercept('/plentysystems/doSaveAddress')
      .as('doSaveAddress')
      .intercept('/plentysystems/getShippingProvider')
      .as('getShippingProvider')
      .intercept('/plentysystems/getPaymentProviders')
      .as('getPaymentProviders');

    this.fillAddressForm('shipping', fixtureOverride);

    cy.wait(['@doSaveAddress', '@getShippingProvider', '@getPaymentProviders'], { timeout: 20000 });

    return this;
  }

  shouldShowShippingAsBillingText() {
    this.shippingAsBillingText.contains('Same as shipping address');
    return this;
  }

  shouldNotShowBillingAddressSelection() {
    this.billingAddressSelect.should('not.exist');
    return this;
  }

  shouldNotShowShippingAddressSelection() {
    this.shippingAddressSelect.should('not.exist');
    return this;
  }

  fillCreditCardForm() {
    cy.iframe('[title=paypal_card_number_field]').find('.card-field-number').first().type('4868719460707704');

    cy.iframe('[title=paypal_card_expiry_field]').find('.card-field-expiry').type('12/27');

    cy.iframe('[title=paypal_card_cvv_field]').find('.card-field-cvv').type('123');

    return this;
  }

  fillMollieCreditCardForm() {
    cy.iframe('[title="cardNumber input"]').find('#cardNumber').type('3782 822463 10005');

    cy.iframe('[title="cardHolder input"]').find('#cardHolder').first().type('Test Holder');

    cy.iframe('[title="expiryDate input"]').find('#expiryDate').first().type('12/29');

    cy.iframe('[title="verificationCode input"]').find('#verificationCode').first().type('1234');

    return this;
  }

  payCreditCard() {
    cy.intercept('/plentysystems/doPlaceOrder')
      .as('doPlaceOrder')
      .intercept('/plentysystems/doCapturePayPalOrderV2')
      .as('doCapturePayPalOrderV2')
      .intercept('/plentysystems/doCreatePlentyPaymentFromPayPalOrder')
      .as('doCreatePlentyPaymentFromPayPalOrder');

    cy.getByTestId('pay-creditcard-button').click();
    cy.wait('@doPlaceOrder').wait('@doCapturePayPalOrderV2').wait('@doCreatePlentyPaymentFromPayPalOrder');
    return this;
  }

  checkCreditCard() {
    cy.intercept('/plentysystems/setPaymentProvider').as('setPaymentProvider');
    cy.getByTestId('payment-method-6008').check({ force: true });
    cy.wait('@setPaymentProvider');
    return this;
  }

  checkInvoice() {
    cy.getByTestId('payment-method-6000').check({ force: true });
    return this;
  }

  checkMolliePayPal() {
    cy.intercept('/plentysystems/setPaymentProvider').as('setPaymentProvider');
    cy.getByTestId('payment-method-6056').check({ force: true });
    cy.wait('@setPaymentProvider');
    return this;
  }

  checkMollieCreditCard() {
    cy.intercept('/plentysystems/setPaymentProvider').as('setPaymentProvider');
    cy.getByTestId('payment-method-6046').check({ force: true });
    cy.wait('@setPaymentProvider');
    return this;
  }

  checkPayPal() {
    cy.intercept('/plentysystems/setPaymentProvider').as('setPaymentProvider');
    cy.getByTestId('payment-method-6001').check({ force: true });
    cy.wait('@setPaymentProvider');
    return this;
  }

  fillAddressForm(addressType: string, fixtureOverride?: AddressFixtureOverride) {
    cy.getFixture('addressForm').then((fixture) => {
      if (fixtureOverride) {
        fixture = { ...fixture, ...fixtureOverride };
      }

      addressType === 'shipping' ? this.fillShippingForm(fixture) : this.fillBillingForm(fixture);
    });

    return this;
  }

  fillPostCodeBillingForm(fixture: AddressFixtureOverride) {
    this.billingAddressForm.within(() => {
      this.countrySelect.select(fixture.country ?? '');
      this.postalCodeInput.type(fixture.zipCode ?? '');
    });

    return this;
  }

  clearPostCodeBillingForm() {
    this.billingAddressForm.within(() => {
      this.postalCodeInput.clear();
    });

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fillShippingForm(fixture: any) {
    cy.wait(1000);
    this.shippingAddressForm.within(() => {
      this.firstNameInput.type(fixture.firstName);
      this.lastNameInput.type(fixture.lastName);
      this.countrySelect.select(fixture.country);
      this.streetNameInput.type(fixture.streetName);
      this.streetNumberInput.type(fixture.apartment);
      this.cityInput.type(fixture.city);
      // this.stateSelect.select(fixture.state);
      this.postalCodeInput.type(fixture.zipCode);
      this.useShippingAsBilling.check();
      this.saveShipping.click({ force: true });
    });

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fillBillingForm(fixture: any) {
    cy.wait(1000);
    this.shippingAddressForm
      .within(() => {
        this.firstNameInput.type(fixture.firstName);
        this.lastNameInput.type(fixture.lastName);
        this.countrySelect.select(fixture.country);
        this.streetNameInput.type(fixture.streetName);
        this.streetNumberInput.type(fixture.apartment);
        this.cityInput.type(fixture.city);
        // this.stateSelect.select(fixture.state);
        this.postalCodeInput.type(fixture.zipCode);
        this.useShippingAsBilling.uncheck();
      })
      .then(() => {
        this.billingAddressForm.within(() => {
          this.firstNameInput.type(fixture.firstName);
          this.lastNameInput.type(fixture.lastName);
          this.countrySelect.select(fixture.country);
          this.streetNameInput.type(fixture.streetName);
          this.streetNumberInput.type(fixture.apartment);
          this.cityInput.type(fixture.city);
          // this.stateSelect.select(fixture.state);
          this.postalCodeInput.type(fixture.zipCode);
          this.saveBilling.click({ force: true });
        });
      });

    return this;
  }

  get payPalButton() {
    return cy.get('.paypal-buttons-context-iframe').first();
  }

  shouldShowShippingMethods() {
    cy.getByTestId('shipping-method-list').should('be.visible');
    cy.getByTestId('no-payment-method-available').should('not.exist');
    return this;
  }

  shouldShowPaymentMethods() {
    cy.getByTestId('no-payment-method-available').should('not.exist');
    return this;
  }

  shouldNotShowShippingMethods() {
    cy.getByTestId('shipping-method-list').should('not.exist');
    cy.getByTestId('no-payment-method-available').should('be.visible');
    return this;
  }
}
