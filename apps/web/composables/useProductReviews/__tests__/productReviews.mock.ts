import type { Review } from '@plentymarkets/shop-api';
export const mockProductReviews: Review = {
  feedbacks: [
    {
      id: 1,
      title: 'title',
      isVisible: true,
      createdAt: '2022-06-27 09:20:16',
      updatedAt: '2022-06-27 09:20:16',
      authorName: 'test',
      feedbackComment: {
        commentId: 'test',
        commentRelationType: 'test',
        commentRelationTargetId: 'test',
        comment: {
          id: 1,
          message: 'test',
          isVisible: 'test',
          createdAt: 'test',
          updatedAt: 'test'
        }
      },
      feedbackRating: {
        ratingId: 'test',
        ratingRelationType: 'test',
        ratingRelationTargetId: 'test',
        rating: {
          id: 'test',
          ratingValue: 'test',
          isVisible: 'test',
          createdAt: 'test',
          updatedAt: 'test'
        }
      },
      targetRelation: {
        feedbackId: 'test',
        feedbackRelationType: 'test',
        feedbackRelationTargetId: 'test',
        variationAttributes: [],
        targetRelationLabel: 'test',
        targetRelationName: [],
        feedbackRelationParentTargetId: 1
      },
      sourceRelation: [{
        feedbackId: 'test',
        feedbackRelationType: 'test',
        feedbackRelationSourceId: 'test',
        sourceRelationLabel: 'test',
        sourceRelationTypeLabel: 'test',
        feedback: {
          id: 1,
          title: 'test',
          isVisible: true,
          createdAt: 'test',
          updatedAt: 'test',
          authorName: 'test'
        }
      }],
      replies: []
    }
  ],
  itemAttributes: [],
  pagination: {
    page: '1',
    lastPage: 1,
    isLastPage: true,
    totalCount: 1
  },
  counts: {
    ratingsCountOf1: 0,
    ratingsCountOf2: 0,
    ratingsCountOf3: 0,
    ratingsCountOf4: 0,
    ratingsCountOf5: 0,
    ratingsCountTotal: 0,
    averageValue: "0.00",
    highestCount: 0,
  },
}
