import type { ReviewItem } from '../@plentymarkets/plentymarkets-sdk/packages/api-client/src';
export const mockProductReviewItems: ReviewItem[] = [
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
      sourceRelation: {
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
      },
      replies: []
    }
]
