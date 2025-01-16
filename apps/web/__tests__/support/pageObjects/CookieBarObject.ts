import { PageObject } from "./PageObject";

export class CookieBarObject extends PageObject {
  get openBtn() {
    return cy.getByTestId('cookie-bar-open-btn');
  }
  get acceptAllBtn() {
    return cy.getByTestId('cookie-bar-accept-all');
  }

  openBar() {
    this.openBtn.click();

    return this;
  }

  acceptAll() {
    this.acceptAllBtn.click();

    return this;
  }

  checkExternalScript() {
    return cy.document().then(() => {
      document.head.innerHTML.includes('test-cookie-external-script.js')
    })
  }
}
