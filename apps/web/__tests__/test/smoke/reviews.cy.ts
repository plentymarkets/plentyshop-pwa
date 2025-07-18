import { paths } from '../../../utils/paths';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { ProductListPageObject } from '../../support/pageObjects/ProductListPageObject';
import { ReviewPageObject } from '../../support/pageObjects/ReviewPageObject';
import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';

const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();
const reviewPage = new ReviewPageObject();
const myAccount: MyAccountPageObject = new MyAccountPageObject();
const cookieBar = new CookieBarObject();

beforeEach(() => {
  cy.clearCookies();
  cy.intercept('/plentysystems/deleteReview').as('deleteReview');
  cy.intercept('/plentysystems/doReview').as('postReview');
  cy.intercept('/plentysystems/setReview').as('setReview');
  cy.intercept('/plentysystems/getReview').as('getReview');

  cy.intercept('/plentysystems/doLogin').as('doLogin');
  cy.visitAndHydrate(paths.authLogin);

  myAccount.successLogin();
  cy.wait('@doLogin').visitAndHydrate(paths.home);
  homePage.goToCategory();
  productListPage.goToProduct();

  reviewPage.deleteAllReviews();

  myAccount.clickTopBarLogoutButton();
});

describe('Reviews functionality check.', () => {
  it('Checks review section.', () => {
    cookieBar.acceptAll();
    cy.visitAndHydrate('/coupons');
    productListPage.goToProduct();

    reviewPage
      .waitFor(['@getReview'])
      .scrollToReviews()
      .checkAverageSectionVisible()
      .checkAverageInformation()
      .checkAddReviewButtonVisible()
      .clickAddReviewButton()
      .checkLoginModalVisible();

    myAccount.successLogin();

    reviewPage
      .checkReviewModalVisible()
      .checkReviewModalElementsVisible()
      .postReview('Great product!', 'John Doe')
      .checkReviewPostedSuccessfully()
      .checkEditRemoveButtonsVisible()
      .clickEditReviewButton()
      .editReview('Title edited', 'John Doe edited', 'This is an edited review message.')
      .checkReviewEditedSuccessfully('John Doe edited', 'This is an edited review message.')
      .addReply()
      .checkReplyAddedSuccessfully()
      .editReply('John Doe edited', 'Thank you! edited')
      .checkReplyEditedSuccessfully('John Doe edited', 'Thank you! edited')
      .removeReply()
      .checkReplyRemovedSuccessfully()
      .removeReview()
      .addMultipleReviews(Number(Cypress.env('DEFAULT_FEEDBACK_ITEMS_PER_PAGE')) + 1)
      .checkPaginationVisible()
      .checkNumberOfItemsPerPage(Number(Cypress.env('DEFAULT_FEEDBACK_ITEMS_PER_PAGE')))
      .navigateToNextPage()
      .checkNumberOfItemsPerPage(1)
      .navigateToPreviousPage()
      .removeMultipleReviews(Number(Cypress.env('DEFAULT_FEEDBACK_ITEMS_PER_PAGE')) + 1);
  });
});
