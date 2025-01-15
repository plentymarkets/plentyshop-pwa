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
  get manufacturerResponsibleInformationName() {
    return cy.getByTestId('manufacturer-responsible-info-name');
  }
  get manufacturerResponsibleInformationStreet() {
    return cy.getByTestId('manufacturer-responsible-info-street');
  }
  get manufacturerResponsibleInformationPostcode() {
    return cy.getByTestId('manufacturer-responsible-info-postcode');
  }
  get manufacturerResponsibleInformationPhone() {
    return cy.getByTestId('manufacturer-responsible-info-phone');
  }
  get manufacturerResponsibleInformationEmail() {
    return cy.getByTestId('manufacturer-responsible-info-email');
  }
  get manufacturerInformationName() {
    return cy.getByTestId('manufacturerInfo-name');
  }
  get productLegalDetailsClose() {
    return cy.getByTestId('product-legal-details-close');
  }

  displayCheck() {
    this.assertProductManufacturerPageElements();
    return this;
  }

  assertProductManufacturerPageElements() {
    this.manufacturerDrawerTrigger.should('be.visible');
    this.manufacturerDrawerTrigger.click();
    this.manufacturerResponsibleInfo.should('be.visible');
    this.manufacturerResponsibleInformation.should('be.visible');
     
    // this.manufacturerResponsibleInformationName.should('be.visible');
    // this.manufacturerResponsibleInformationStreet.should('be.visible');
    // this.manufacturerResponsibleInformationPostcode.should('be.visible');
    // this.manufacturerResponsibleInformationPhone.should('be.visible');
    // this.manufacturerResponsibleInformationEmail.should('be.visible');


    this.manufacturerResponsibleInformation.click()
    // this.manufacturerInformationName.should('be.visible');
    this.productLegalDetailsClose.click();

    this.manufacturerResponsibleInfo.should('not.exist');
    return this;
  }
}
