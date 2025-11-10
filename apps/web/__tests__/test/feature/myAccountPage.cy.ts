import { paths } from '../../../app/utils/paths';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';

const myAccount: MyAccountPageObject = new MyAccountPageObject();

beforeEach(() => {
  cy.intercept('/plentysystems/doLogin').as('doLogin');
  cy.visitAndHydrate(paths.authLogin);
  myAccount.successLogin();

  cy.wait('@doLogin').visitAndHydrate(paths.home);
});

describe('Smoke: My Account', () => {
  it('[smoke] Navigating to My Account from top header', () => {
    myAccount.clickTopBarMyAccountLink();
  });

  it('[smoke] Navigating to My Orders from top header', () => {
    myAccount.clickTopBarMyOrdersLink();
  });

  it('[smoke] Navigating to Returns from top header', () => {
    myAccount.clickTopBarReturnsLink();
  });

  it('[smoke] Checking all My Account sections functionality', () => {
    cy.visitAndHydrate(paths.account);

    myAccount
      .checkAllSectionsMenu()
      .checkPersonalDataSection()
      .checkBillingAddressesSection()
      .checkShippingAddressesSection()
      .checkMyOrdersSection()
      .checkReturnsSection()
      .checkWishlistSection()
      .checkLogoutSection();
  });
});
