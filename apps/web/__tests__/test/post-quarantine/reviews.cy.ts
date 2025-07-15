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

  cy.visitAndHydrate(paths.home);

  cookieBar.acceptAll();
});

describe('Reviews functionality check.', () => {
  it('Deletes all reviews.', () => {
    cy.visitAndHydrate(paths.authLogin);
    myAccount.successLogin();

    cy.wait('@doLogin');
    cy.visitAndHydrate(paths.home);

    homePage.goToCategory();
    productListPage.goToProduct();

    reviewPage.deleteAllReviews();
  });

  it('Checks review section elements.', () => {
    homePage.goToCategory();
    productListPage.goToProduct();

    reviewPage
      .scrollToReviews()
      .checkAverageSectionVisible()
      .checkAverageInformation()
      .checkAddReviewButtonVisible()
      .clickAddReviewButton()
      .checkLoginModalVisible();
  });

  it('Create and Edit review', () => {
    homePage.goToCategory();
    productListPage.goToProduct();

    reviewPage.scrollToReviews().clickAddReviewButton();

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
      .removeReview();
  });

  it('Create & Edit & Update reply.', () => {
    homePage.goToCategory();
    productListPage.goToProduct();

    reviewPage
      .scrollToReviews()
      .clickAddReviewButton();

    myAccount.successLogin();

    reviewPage
      .postReview('Great product!', 'John Doe')
      .addReply()
      .checkReplyAddedSuccessfully()
      .editReply('John Doe edited', 'Thank you! edited')
      .checkReplyEditedSuccessfully('John Doe edited', 'Thank you! edited')
      .removeReply()
      .checkReplyRemovedSuccessfully()
      .removeReview();
  });
});
