import type { ReviewItem } from '@plentymarkets/shop-api';
export const mockProductReviewItems: ReviewItem[] = [
  {
    id: 1,
    title: 'title',
    isVisible: true,
    createdAt: '2024-04-10T18:55:44+02:00',
    updatedAt: '2024-04-10T18:55:44+02:00',
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
        updatedAt: 'test',
      },
    },
    feedbackRating: {
      ratingId: 'test',
      ratingRelationType: 'test',
      ratingRelationTargetId: 'test',
      rating: {
        id: 'test',
        ratingValue: '4',
        isVisible: 'test',
        createdAt: 'test',
        updatedAt: 'test',
      },
    },
    targetRelation: {
      feedbackId: 'test',
      feedbackRelationType: 'test',
      feedbackRelationTargetId: 'test',
      variationAttributes: [],
      targetRelationLabel: 'test',
      targetRelationName: [],
      feedbackRelationParentTargetId: 1,
    },
    sourceRelation: [
      {
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
          authorName: 'test',
        },
      },
    ],
    replies: [],
  },
];
