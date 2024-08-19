import { paths } from '../../../utils/paths';
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
        .postReview('Great product!')
        .checkReviewPostedSuccessfully()
        .checkEditRemoveButtonsVisible()
        .addReply()
        .checkReplyAddedSuccessfully()
        .removeReply()
        .checkReplyRemovedSuccessfully()
        .removeReview()
        .checkNoReviewTextVisible()
        // .addMultipleReviews(10 + 1)
        // .checkPaginationVisible()
        // .navigateThroughPages()
  });
});
