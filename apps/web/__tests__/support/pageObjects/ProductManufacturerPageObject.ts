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
    this.assertProductDetailPageElements();
    return this;
  }

  assertProductDetailPageElements() {
    this.manufacturerDrawerTrigger.should('be.visible');
    this.manufacturerDrawerTrigger.click();
    this.manufacturerResponsibleInfo.should('be.visible');
    this.manufacturerResponsibleInformation.should('be.visible');
     
    this.manufacturerResponsibleInformationName.should('contain', 'Matthias Richter');
    this.manufacturerResponsibleInformationStreet.should('contain', 'Sophienstraße 13');
    this.manufacturerResponsibleInformationPostcode.should('contain', '80333');
    this.manufacturerResponsibleInformationPhone.should('contain', '+49 89 98765432');
    this.manufacturerResponsibleInformationEmail.should('contain', 'eu-representative@acdesign.eu');


    this.manufacturerResponsibleInformation.click()
    this.manufacturerInformationName.should('contain', 'A & C Design');
    this.productLegalDetailsClose.click();

    this.manufacturerResponsibleInfo.should('not.exist');
    return this;
  }
}
