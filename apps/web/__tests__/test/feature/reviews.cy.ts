import { paths } from '../../../utils/paths';
import { defaults } from '../../../composables/defaults';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import {ProductListPageObject} from "../../support/pageObjects/ProductListPageObject";
import {ReviewPageObject} from "../../support/pageObjects/ReviewPageObject";
import {MyAccountPageObject} from "../../support/pageObjects/MyAccountPageObject";

const homePage = new HomePageObject();
const productListPage = new ProductListPageObject();
const reviewPage = new ReviewPageObject();
const myAccount: MyAccountPageObject = new MyAccountPageObject();

beforeEach(() => {
  cy.clearCookies();
  cy.setCookie('vsf-locale', 'en');
  cy.intercept('/plentysystems/deleteReview').as('deleteReview');
  cy.intercept('/plentysystems/doReview').as('postReview');


  cy.intercept('/plentysystems/doLogin').as('doLogin');
  cy.visitAndHydrate(paths.authLogin);

  myAccount.successLogin();
  cy.wait('@doLogin').visitAndHydrate(paths.home);
  homePage.goToCategory();
  productListPage.goToProduct();

  cy.get('body').then(($body) => {
    const reviewLength = $body.find('[data-testid="review-item"]').length;

    for (let i = 0; i < reviewLength; i++) {
        reviewPage.removeReview();
    }
  });

  myAccount.clickTopBarLogoutButton();
  cy.visitAndHydrate(paths.home);
});

describe('Reviews functionality check.', () => {
  it('Checks review section.', () => {
    homePage.goToCategory();
    productListPage.goToProduct();

    reviewPage
        .scrollToReviews()
        .checkNoReviewTextVisible()
        .checkAverageSectionVisible()
        .checkAverageInformation()
        .checkAddReviewButtonVisible()
        .clickAddReviewButton()
        .checkLoginModalVisible()

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
        .checkNoReviewTextVisible()
        .addMultipleReviews(defaults.DEFAULT_FEEDBACK_ITEMS_PER_PAGE + 1)
        .checkPaginationVisible()
        .checkNumberOfItemsPerPage(defaults.DEFAULT_FEEDBACK_ITEMS_PER_PAGE)
        .navigateToNextPage()
        .checkNumberOfItemsPerPage(1)
        .navigateToPreviousPage()
        .removeMultipleReviews(defaults.DEFAULT_FEEDBACK_ITEMS_PER_PAGE + 1)
        .checkNoReviewTextVisible()
  });
});
