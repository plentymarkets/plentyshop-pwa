import { PageObject } from './PageObject';

export class PreferredDeliveryObject extends PageObject {
  shouldShowPreferredDeliverySurcharge() {
    throw new Error('Method not implemented.');
  }

  get preferredDeliveryContainer() {
    return cy.getByTestId('preferred-delivery');
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
