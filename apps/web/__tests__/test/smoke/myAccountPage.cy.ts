import { paths } from '../../../utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';

const myAccount: MyAccountPageObject = new MyAccountPageObject();

describe('my account', () => {
  it('going to login and authenticate', () => {
    cy.visitAndHydrate(paths.authLogin);

    myAccount.successLogin();
    myAccount.clickTopBarMyAccountLink();
  });

  // it('going to my account from header', () => {
  //   cy.visitAndHydrate(paths.home);
  //
  //   myAccount.clickTopBarMyAccountLink();
  // });
  //
  // it('checking my account section', () => {
  //   cy.visitAndHydrate(paths.account);
  //
  //   myAccount
  //     .checkAllSections()
  //     .personalDataSection()
  //     .billingDetailsSection()
  //     .shippingDetailsSection()
  //     .myOrdersSection()
  //     .returnsSection();
  // });
});
