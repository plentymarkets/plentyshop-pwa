export class PaymentStatusScreen {
  /**
   * Gets the description of the started order/transaction.
   * @returns {*}
   */
  getDescription() {
    return cy.get('.header__info');
  }

  /**
   * Gets the merchant name of the started order/transaction.
   * @returns {*}
   */
  getMerchantName() {
    return cy.get('.header__merchant-name');
  }

  /**
   * Gets the total amount that will be
   * paid with Mollie.
   * @returns {*}
   */
  getAmount() {
    return cy.get('.header__amount');
  }

  /**
   * Verifies that the displayed total amount on the Mollie
   * page matches the amount that you have provided.
   * Use this to verify that the user has to pay
   * the correct price in Mollie.
   *
   * @param amount
   *
   * @deprecated will be removed one day. please use the dedicated Assertion class PaymentStatusScreenAssertion.js in the future
   */
  assertAmount(amount: number) {
    let searchAmount = amount.toString();
    searchAmount = searchAmount.replace(',', '');
    searchAmount = searchAmount.replace('.', '');

    this.getAmount().then(($headerAmount) => {
      let finalHeaderAmount = $headerAmount.text();
      finalHeaderAmount = finalHeaderAmount.replace(',', '');
      finalHeaderAmount = finalHeaderAmount.replace('.', '');

      expect(finalHeaderAmount).to.contain(searchAmount);
    });
  }

  /**
   *
   */
  selectOpen() {
    cy.get('input[value="open"]').click();

    this._clickSubmit();
  }

  /**
   *
   */
  selectPaid() {
    cy.get('input[value="paid"]').click();

    this._clickSubmit();
  }

  /**
   *
   */
  selectPending() {
    cy.get('input[value="pending"]').click();

    this._clickSubmit();
  }

  /**
   *
   */
  selectAuthorized() {
    cy.get('input[value="authorized"]').click();

    this._clickSubmit();
  }

  /**
   *
   */
  selectFailed() {
    cy.get('input[value="failed"]').click();

    this._clickSubmit();
  }

  /**
   *
   */
  selectCancelled() {
    cy.get('input[value="canceled"]').click();

    this._clickSubmit();
  }

  /**
   *
   */
  selectExpired() {
    cy.get('input[value="expired"]').click();

    this._clickSubmit();
  }

  /**
   * Navigates back by using the "Payment methods" link in the footer.
   */
  goBack() {
    cy.get('.button--link').click();
  }

  /**
   *
   * @param language
   */
  selectLocale(language: string) {
    cy.get('#select-locale').select(language);
  }

  /**
   *
   * @private
   */
  _clickSubmit() {
    cy.get('.button').click();
  }
}
