import { PageObject } from "./PageObject";

export class ReviewPageObject extends PageObject{
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

  postReview(title: string) {
    cy.get('[data-testid="review-modal"] input[name="authorName"]').type(title);
    cy.get('[data-testid="review-modal"] input[name="title"]').type(title);
    cy.get('[data-testid="ratingbutton"] label').click({multiple: true});
    cy.get('[data-testid="review-modal"] textarea[name="message"]').type('This is a review message.');
    cy.get('[data-testid="review-modal"] button[type="submit"]').click();

    cy.wait('@postReview')

    return this;
  }

  checkReviewPostedSuccessfully() {
    cy.get('[data-testid="review-item"]').should('contain', 'This is a review message.');

    return this;
  }

  checkEditRemoveButtonsVisible() {
    cy.get('[data-testid="edit-review-button"]').should('be.visible');
    cy.get('[data-testid="remove-review-button"]').should('be.visible');

    return this;
  }

  addReply() {
    cy.get('[data-testid="add-reply-button"]').click();
    cy.get('[data-testid="review-answer-form"] textarea[name="message"]').type('Thank you!');
    cy.get('[data-testid="review-answer-form"] button[type="submit"]').click();

    return this;
  }

  checkReplyAddedSuccessfully() {
    cy.get('[data-testid="show-replies"]').click();
    cy.get('[data-testid="reply-item"]').should('contain', 'Thank you!');

    return this;
  }

  removeReply() {
    cy.get('[data-testid="remove-reply-button"]').click();
    cy.get('[data-testid="confirm-delete"]').click();

    return this;
  }

  checkReplyRemovedSuccessfully() {
    cy.get('[data-testid="reply-item"]').should('not.exist');

    return this;
  }

  removeReview() {
    cy.get('[data-testid="remove-review-button"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.wait('@deleteReview')

    return this;
  }

  removeMultipleReviews(count: number) {
    for (let i = 0; i < count; i++) {
      this.removeReview();
      cy.wait(0.5)
    }

    return this;
  }

  addMultipleReviews(count: number) {
    for (let i = 0; i < count; i++) {
      this.clickAddReviewButton()
      this.postReview(`Review ${i + 1}`);
      cy.wait(0.5)
    }

    return this;
  }

  checkPaginationVisible() {
    cy.get('[data-testid="pagination"]').should('exist').scrollIntoView();

    return this;
  }

  checkNumberOfItemsPerPage(expectedCount: number) {
    cy.get('[data-testid="review-item"]').should('have.length', expectedCount);
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
}
