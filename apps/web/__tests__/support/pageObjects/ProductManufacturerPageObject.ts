import { PageObject } from "./PageObject";

export class ProductManufacturerPageObject extends PageObject {
  get manufacturerDrawerTrigger() {
    return cy.getByTestId('open-manufacturer-drawer');
  }

  get manufacturerResponsibleInfo() {
    return cy.getByTestId('ManufacturerResponsibleInfo');
  }

  get manufacturerResponsibleInformation() {
    return cy.getByTestId('ManufacturerInformation');
  }

  displayCheck() {
    this.assertProductDetailPageElements();
    return this;
  }

  assertProductDetailPageElements() {
    this.manufacturerDrawerTrigger.should('be.visible');
    this.manufacturerDrawerTrigger.click();
    this.manufacturerResponsibleInfo.should('be.visible');
    this.manufacturerResponsibleInformation.should('be.visible');
    //  check info from tab1
    // click on tab2 check info
    // check close action
    return this;
  }
}
