import { PageObject } from './PageObject';

export class PreferredDeliveryObject extends PageObject {
  shouldShowPreferredDeliverySurcharge() {
    throw new Error('Method not implemented.');
  }

  get preferredDeliveryContainer() {
    return cy.getByTestId('preferred-delivery');
  }

  get preferredDeliveryDayCheckbox() {
    return cy.getByTestId('preferred-delivery-day');
  }

  get preferredDeliveryLocation() {
    return cy.getByTestId('preferred-delivery-location');
  }

  get preferredDeliverySubmitButton() {
    return cy.getByTestId('preferred-delivery-submit');
  }

  checkPreferredDeliveryDayCheckbox(): this {
    this.preferredDeliveryDayCheckbox.find('input').check();
    return this;
  }

  fillPreferredDeliveryLocation(location: string): this {
    this.preferredDeliveryLocation.type(location);
    return this;
  }

  submitPreferredDeliveryForm(): this {
    cy.intercept('/plentysystems/doSavePreferredDeliveryServices').as('doSavePreferredDeliveryServices');
    this.preferredDeliverySubmitButton.click();
    cy.wait('@doSavePreferredDeliveryServices');
    return this;
  }

  shouldShowPreferredDelivery(): this {
    this.preferredDeliveryContainer.should('exist');
    return this;
  }

  shouldNotShowPreferredDelivery(): this {
    this.preferredDeliveryContainer.should('not.exist');
    return this;
  }
}
