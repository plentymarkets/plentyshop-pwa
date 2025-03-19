import { PageObject } from './PageObject';

export class ReviewPageObject extends PageObject {
  scrollToReviews() {
    cy.get('[data-testid="show-reviews"]').click();

    return this;
  }
  checkNoReviewTextVisible() {
    cy.get('[data-testid="no-review-text"]').should('be.visible');

    return this;
  }

  checkAverageSectionVisible() {
    cy.get('[data-testid="average-section"]').should('be.visible');

    return this;
  }

  checkAverageInformation() {
    cy.get('[data-testid="average-info"]').should('be.visible');
    cy.get('[data-testid="review-count"]').should('be.visible');

    return this;
  }

  checkAddReviewButtonVisible() {
    cy.get('[data-testid="add-review-button"]').should('be.visible');

    return this;
  }

  clickAddReviewButton() {
    cy.get('[data-testid="add-review-button"]').click();

    return this;
  }

  checkLoginModalVisible() {
    cy.get('[data-testid="login-modal"]').should('be.visible');

    return this;
  }

  checkReviewModalVisible() {
    cy.get('[data-testid="review-modal"]').should('be.visible');

    return this;
  }

  checkReviewModalElementsVisible() {
    cy.get('[data-testid="review-modal"] input[name="authorName"]').should('be.visible');
    cy.get('[data-testid="review-modal"] input[name="title"]').should('be.visible');
    cy.get('[data-testid="review-modal"] textarea[name="message"]').should('be.visible');
    cy.get('[data-testid="review-modal"] button[type="submit"]').should('be.visible');

    return this;
  }

  postReview(title: string, authorName: string) {
    cy.get('[data-testid="review-modal"] input[name="authorName"]').type(authorName);
    cy.get('[data-testid="review-modal"] input[name="title"]').type(title);
    cy.get('[data-testid="ratingbutton"] label').click({ multiple: true });
    cy.get('[data-testid="review-modal"] textarea[name="message"]').type('This is a review message.');
    cy.get('[data-testid="review-modal"] button[type="submit"]').click();

    cy.wait(['@postReview', '@getReview']);

    return this;
  }

  checkReviewPostedSuccessfully() {
    cy.get('[data-testid="review-item"]').should('contain', 'This is a review message.');
    cy.get('[data-testid="review-item-authorName"]').should('contain', 'John Doe');

    return this;
  }

  checkEditRemoveButtonsVisible() {
    cy.get('[data-testid="edit-review-button"]').should('be.visible');
    cy.get('[data-testid="remove-review-button"]').should('be.visible');

    return this;
  }

  addReply() {
    cy.get('[data-testid="add-reply-button"]').first().click();
    cy.get('[data-testid="review-answer-form"] textarea[name="message"]').type('Thank you!');
    cy.get('[data-testid="review-answer-form"] button[type="submit"]').click();

    cy.wait(['@postReview', '@getReview']);

    return this;
  }

  checkReplyAddedSuccessfully() {
    cy.get('[data-testid="show-replies"]').first().click();
    cy.get('[data-testid="reply-item"]').should('contain', 'Thank you!');

    return this;
  }

  removeReply() {
    cy.get('[data-testid="remove-reply-button"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.wait(['@deleteReview', '@getReview']);

    return this;
  }

  checkReplyRemovedSuccessfully() {
    cy.get('[data-testid="reply-item"]').should('not.exist');

    return this;
  }

  removeReview() {
    cy.get('[data-testid="remove-review-button"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.wait(['@deleteReview', '@getReview']);

    return this;
  }

  removeMultipleReviews(count: number) {
    for (let i = 0; i < count; i++) {
      this.removeReview();
      cy.wait(1000);
    }

    return this;
  }

  addMultipleReviews(count: number) {
    for (let i = 0; i < count; i++) {
      this.clickAddReviewButton();
      this.postReview(`Review ${i + 1}`, 'John Doe');
      cy.wait(1000);
    }

    return this;
  }

  checkPaginationVisible() {
    cy.get('[data-testid="pagination"]').should('exist').scrollIntoView();

    return this;
  }

  checkNumberOfItemsPerPage(expectedCount: number) {
    cy.get('[data-testid="review-item"]').should('have.length.gte', expectedCount);
    return this;
  }

  navigateToNextPage() {
    cy.get('[data-testid="pagination-next"]').click();
    return this;
  }

  navigateToPreviousPage() {
    cy.get('[data-testid="pagination-previous"]').click();
    return this;
  }

  clickEditReviewButton() {
    cy.get('[data-testid="edit-review-button"]').click();

    return this;
  }

  editReview(title: string, authorName: string, message: string) {
    cy.get('[data-testid="review-modal"] input[name="authorName"]').clear().type(authorName);
    cy.get('[data-testid="review-modal"] input[name="title"]').clear().type(title);
    cy.get('[data-testid="ratingbutton"] label').click({ multiple: true });
    cy.get('[data-testid="review-modal"] textarea[name="message"]').clear().type(message);
    cy.get('[data-testid="review-modal"] button[type="submit"]').click();
    cy.wait(['@setReview', '@getReview']);

    return this;
  }

  checkReviewEditedSuccessfully(authorName: string, message: string) {
    cy.get('[data-testid="review-item"]').should('contain', message);
    cy.get('[data-testid="review-item-authorName"]').should('contain', authorName);

    return this;
  }

  editReply(authorName: string, message: string) {
    cy.get('[data-testid="edit-reply-button"]').click();
    cy.get('[data-testid="review-modal"] input[name="authorName"]').clear().type(authorName);
    cy.get('[data-testid="review-modal"] textarea[name="message"]').clear().type(message);
    cy.get('[data-testid="review-modal"] button[type="submit"]').click();
    cy.wait(['@setReview', '@getReview']);

    return this;
  }

  checkReplyEditedSuccessfully(authorName: string, message: string) {
    cy.get('[data-testid="reply-item"]').should('contain', message);
    cy.get('[data-testid="reply-item-authorName"]').should('contain', authorName);

    return this;
  }

  deleteAllReviews() {
    cy.wait(1000);

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="remove-review-button"]').length > 0) {
        this.removeReview();
        this.deleteAllReviews();
      }
    });
  }
}
